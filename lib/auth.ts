import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { isValidEmail, sanitizeString } from './utils/validation';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days

export interface AdminSession {
  email: string;
  expiresAt: number;
}

/**
 * Verify admin credentials against environment variables
 * Supports both plain text (for migration) and bcrypt hashed passwords
 */
export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  // Sanitize inputs
  const sanitizedEmail = sanitizeString(email).toLowerCase();
  const sanitizedPassword = sanitizeString(password);

  if (!isValidEmail(sanitizedEmail) || !sanitizedPassword) {
    return false;
  }

  const admin1Email = process.env.ADMIN_EMAIL_1?.toLowerCase();
  const admin1Password = process.env.ADMIN_PASSWORD_1;
  const admin1PasswordHash = process.env.ADMIN_PASSWORD_1_HASH; // Optional bcrypt hash
  const admin2Email = process.env.ADMIN_EMAIL_2?.toLowerCase();
  const admin2Password = process.env.ADMIN_PASSWORD_2;
  const admin2PasswordHash = process.env.ADMIN_PASSWORD_2_HASH; // Optional bcrypt hash

  if (!admin1Email || (!admin1Password && !admin1PasswordHash) || 
      !admin2Email || (!admin2Password && !admin2PasswordHash)) {
    return false;
  }

  // Check if email matches admin 1
  if (sanitizedEmail === admin1Email) {
    // If hash exists, use bcrypt comparison
    if (admin1PasswordHash) {
      return await bcrypt.compare(sanitizedPassword, admin1PasswordHash);
    }
    // Fallback to plain text (for migration period)
    return sanitizedPassword === admin1Password;
  }
  
  // Check if email matches admin 2
  if (sanitizedEmail === admin2Email) {
    // If hash exists, use bcrypt comparison
    if (admin2PasswordHash) {
      return await bcrypt.compare(sanitizedPassword, admin2PasswordHash);
    }
    // Fallback to plain text (for migration period)
    return sanitizedPassword === admin2Password;
  }

  return false;
}

/**
 * Create a session for authenticated admin
 * 
 * Creates an httpOnly cookie session that expires after SESSION_DURATION.
 * The session is stored as JSON in a secure cookie that cannot be accessed
 * by JavaScript (httpOnly), preventing XSS attacks.
 * 
 * @param email - Admin email address
 * @returns Sanitized email address
 * 
 * Security features:
 * - httpOnly: Cookie not accessible via JavaScript
 * - secure: Only sent over HTTPS in production
 * - sameSite: 'strict' prevents CSRF attacks
 * - Expires after 7 days
 */
export async function createSession(email: string): Promise<string> {
  const sanitizedEmail = sanitizeString(email).toLowerCase();
  
  // Create session object with expiration timestamp
  const session: AdminSession = {
    email: sanitizedEmail,
    expiresAt: Date.now() + SESSION_DURATION * 1000, // Current time + 7 days
  };

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true, // Prevent JavaScript access (XSS protection)
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict', // CSRF protection - cookie only sent on same-site requests
    maxAge: SESSION_DURATION, // Cookie expires after 7 days
    path: '/', // Available site-wide
  });

  return sanitizedEmail;
}

/**
 * Get current admin session from cookie
 * 
 * Validates the session by checking:
 * - Session exists and is valid JSON
 * - Session structure is correct (email and expiresAt present)
 * - Session has not expired
 * - Email in session matches a valid admin email
 * 
 * @returns AdminSession if valid, null otherwise
 */
export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie) {
    return null;
  }

  try {
    const session: AdminSession = JSON.parse(sessionCookie.value);
    
    // Validate session structure - must have email and expiration
    if (!session.email || !session.expiresAt) {
      return null;
    }
    
    // Check if session has expired
    if (Date.now() > session.expiresAt) {
      return null;
    }

    // Verify email is still a valid admin (case-insensitive comparison)
    // This ensures that if admin emails change, old sessions become invalid
    const admin1Email = process.env.ADMIN_EMAIL_1?.toLowerCase();
    const admin2Email = process.env.ADMIN_EMAIL_2?.toLowerCase();
    const sessionEmail = session.email.toLowerCase();
    
    if (sessionEmail !== admin1Email && sessionEmail !== admin2Email) {
      return null;
    }

    return session;
  } catch {
    // Invalid JSON or other parsing error
    return null;
  }
}

/**
 * Destroy admin session
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Check if user is authenticated (middleware helper)
 */
export async function requireAuth(): Promise<AdminSession> {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  return session;
}

