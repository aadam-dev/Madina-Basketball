/**
 * Admin Authentication API Route
 * 
 * Handles admin login with rate limiting, input validation, and session creation.
 * 
 * POST /api/auth/login
 * Body: { email: string, password: string }
 * 
 * Returns:
 * - 200: { success: true } - Login successful
 * - 400: { error: string } - Validation error
 * - 401: { error: string } - Invalid credentials
 * - 429: { error: string } - Rate limit exceeded
 * - 500: { error: string } - Server error
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentials, createSession } from '@/lib/auth';
import { isValidEmail, sanitizeString } from '@/lib/utils/validation';
import { ValidationError, handleApiError } from '@/lib/utils/errors';

/**
 * Rate limiting configuration
 * Uses in-memory storage for simplicity. For production at scale, consider Redis.
 */
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5; // Maximum failed attempts allowed
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes in milliseconds

/**
 * Check if a login attempt is within rate limits
 * 
 * @param identifier - Unique identifier (IP:email combination)
 * @returns true if within limits, false if rate limited
 */
function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const attempts = loginAttempts.get(identifier);

  // No previous attempts or window expired - reset counter
  if (!attempts || now > attempts.resetAt) {
    loginAttempts.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  // Exceeded maximum attempts
  if (attempts.count >= MAX_ATTEMPTS) {
    return false;
  }

  // Increment attempt counter
  attempts.count++;
  return true;
}

/**
 * Handle POST request for admin login
 * 
 * Process:
 * 1. Validate input (email and password required)
 * 2. Sanitize inputs to prevent XSS
 * 3. Check rate limits (prevent brute force)
 * 4. Verify credentials against environment variables
 * 5. Create session cookie on success
 * 6. Return appropriate response
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Step 1: Validate required fields
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    // Step 2: Sanitize inputs to prevent XSS attacks
    const sanitizedEmail = sanitizeString(email);
    const sanitizedPassword = sanitizeString(password);

    // Step 3: Validate email format
    if (!isValidEmail(sanitizedEmail)) {
      throw new ValidationError('Invalid email format');
    }

    // Step 4: Rate limiting - prevent brute force attacks
    // Extract client IP from headers (supports proxies/load balancers)
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const rateLimitKey = `${clientIp}:${sanitizedEmail}`;

    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Step 5: Verify credentials (supports both plain text and bcrypt hashed passwords)
    const isValid = await verifyAdminCredentials(sanitizedEmail, sanitizedPassword);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Step 6: Successful login - reset rate limit and create session
    loginAttempts.delete(rateLimitKey);
    await createSession(sanitizedEmail);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

