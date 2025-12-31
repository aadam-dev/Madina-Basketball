/**
 * Environment Variable Validation and Utilities
 * 
 * Provides utilities for validating and accessing environment variables.
 * Helps catch configuration errors early in development.
 * 
 * Usage:
 *   import { validateEnv, getEnv, isProduction } from '@/lib/utils/env';
 * 
 *   // Validate all required vars are set
 *   const { valid, missing } = validateEnv();
 *   if (!valid) {
 *     console.error('Missing env vars:', missing);
 *   }
 * 
 *   // Get env var with error if missing
 *   const dbUrl = getEnv('DATABASE_URL');
 */

/**
 * Required environment variables
 * Application will fail to start if any of these are missing
 */
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'ADMIN_EMAIL_1',
  'ADMIN_PASSWORD_1',
  'ADMIN_EMAIL_2',
  'ADMIN_PASSWORD_2',
] as const;

/**
 * Optional environment variables
 * These enhance functionality but aren't required
 */
const optionalEnvVars = [
  'ADMIN_PASSWORD_1_HASH', // Bcrypt hash for admin 1 password (recommended)
  'ADMIN_PASSWORD_2_HASH', // Bcrypt hash for admin 2 password (recommended)
] as const;

/**
 * Validate that all required environment variables are set
 * 
 * @returns Object with validation status and list of missing variables
 * 
 * @example
 * const { valid, missing } = validateEnv();
 * if (!valid) {
 *   console.error('Missing:', missing);
 * }
 */
export function validateEnv(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Get environment variable with validation
 * Throws error if variable is missing and no default provided
 * 
 * @param key - Environment variable name
 * @param defaultValue - Optional default value if variable not set
 * @returns Environment variable value
 * @throws Error if variable is missing and no default provided
 * 
 * @example
 * const dbUrl = getEnv('DATABASE_URL');
 * const port = getEnv('PORT', '3000'); // Uses default if not set
 */
export function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

/**
 * Check if application is running in production mode
 * 
 * @returns true if NODE_ENV === 'production'
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if application is running in development mode
 * 
 * @returns true if NODE_ENV === 'development'
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

