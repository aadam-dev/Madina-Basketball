/**
 * Logging Utility
 * 
 * Provides a centralized logging system that:
 * - Logs to console in development
 * - Can be extended to send logs to external services in production
 * - Prevents sensitive data from being logged
 * - Provides consistent log format
 * 
 * Usage:
 *   import { logger } from '@/lib/utils/logger';
 * 
 *   logger.error('Failed to fetch data', error);
 *   logger.info('User logged in', { userId: '123' });
 *   logger.warn('Rate limit approaching', { remaining: 5 });
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogContext {
  [key: string]: any;
}

/**
 * Logger class
 * Handles all application logging
 */
class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  /**
   * Log an error
   * Always logs errors, even in production (but may send to external service)
   */
  error(message: string, error?: any, context?: LogContext): void {
    const logData = {
      level: 'error' as LogLevel,
      message,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
      } : error,
      context: this.sanitizeContext(context),
      timestamp: new Date().toISOString(),
    };

    if (this.isDevelopment) {
      console.error('❌', message, error, context);
    } else {
      // In production, send to error tracking service
      // Example: Sentry.captureException(error, { extra: context });
      console.error(`[ERROR] ${message}`, this.sanitizeForProduction(logData));
    }
  }

  /**
   * Log a warning
   */
  warn(message: string, context?: LogContext): void {
    const logData = {
      level: 'warn' as LogLevel,
      message,
      context: this.sanitizeContext(context),
      timestamp: new Date().toISOString(),
    };

    if (this.isDevelopment) {
      console.warn('⚠️', message, context);
    } else {
      console.warn(`[WARN] ${message}`, this.sanitizeForProduction(logData));
    }
  }

  /**
   * Log informational message
   */
  info(message: string, context?: LogContext): void {
    const logData = {
      level: 'info' as LogLevel,
      message,
      context: this.sanitizeContext(context),
      timestamp: new Date().toISOString(),
    };

    if (this.isDevelopment) {
      console.info('ℹ️', message, context);
    } else {
      // Only log info in production if needed
      // console.info(`[INFO] ${message}`, this.sanitizeForProduction(logData));
    }
  }

  /**
   * Log debug message
   * Only logs in development
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug('🔍', message, context);
    }
    // Never log debug in production
  }

  /**
   * Sanitize context to remove sensitive data
   */
  private sanitizeContext(context?: LogContext): LogContext | undefined {
    if (!context) return undefined;

    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'authorization', 'cookie'];
    const sanitized = { ...context };

    for (const key in sanitized) {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some(sk => lowerKey.includes(sk))) {
        sanitized[key] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  /**
   * Sanitize log data for production
   * Removes stack traces and other sensitive info
   */
  private sanitizeForProduction(data: any): any {
    if (!this.isProduction) return data;

    const sanitized = { ...data };
    if (sanitized.error?.stack) {
      delete sanitized.error.stack;
    }
    return sanitized;
  }
}

// Export singleton instance
export const logger = new Logger();

// Export types for TypeScript
export type { LogLevel, LogContext };

