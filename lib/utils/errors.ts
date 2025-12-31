/**
 * Standardized error handling utilities
 * 
 * Provides consistent error handling across all API routes with:
 * - Custom error classes for different error types
 * - Standardized error response format
 * - Security-conscious error messages (hide internal details in production)
 */

import { NextResponse } from 'next/server';

/**
 * Base application error class
 * All custom errors extend this class
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

/**
 * Handle API errors and return standardized JSON responses
 * 
 * Provides consistent error format across all API endpoints:
 * {
 *   error: string,  // User-friendly error message
 *   code: string    // Error code for programmatic handling
 * }
 * 
 * Security: In production, internal error details are hidden to prevent
 * information leakage that could aid attackers.
 * 
 * @param error - Error object (AppError, Error, or unknown)
 * @returns NextResponse with standardized error format
 */
export function handleApiError(error: unknown): NextResponse {
  // Handle custom application errors
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  // Handle standard JavaScript errors
  if (error instanceof Error) {
    // Security: Don't expose internal error details in production
    // This prevents information leakage that could help attackers
    const message =
      process.env.NODE_ENV === 'production'
        ? 'An internal error occurred'
        : error.message;

    return NextResponse.json(
      {
        error: message,
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }

  // Handle unknown error types
  return NextResponse.json(
    {
      error: 'An unknown error occurred',
      code: 'UNKNOWN_ERROR',
    },
    { status: 500 }
  );
}

/**
 * Wrap API route handlers with error handling
 */
export function withErrorHandling(
  handler: (request: Request, context?: any) => Promise<NextResponse>
) {
  return async (request: Request, context?: any) => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error('API Error:', error);
      return handleApiError(error);
    }
  };
}

