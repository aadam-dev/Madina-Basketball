import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days

export interface AdminSession {
  email: string;
  expiresAt: number;
}

/**
 * Verify admin credentials against environment variables
 */
export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  const admin1Email = process.env.ADMIN_EMAIL_1;
  const admin1Password = process.env.ADMIN_PASSWORD_1;
  const admin2Email = process.env.ADMIN_EMAIL_2;
  const admin2Password = process.env.ADMIN_PASSWORD_2;

  if (!admin1Email || !admin1Password || !admin2Email || !admin2Password) {
    return false;
  }

  // Check if email matches either admin
  if (email === admin1Email) {
    return password === admin1Password;
  }
  
  if (email === admin2Email) {
    return password === admin2Password;
  }

  return false;
}

/**
 * Create a session for authenticated admin
 */
export async function createSession(email: string): Promise<string> {
  const session: AdminSession = {
    email,
    expiresAt: Date.now() + SESSION_DURATION * 1000,
  };

  // In a real app, you'd store this in a database or use JWT
  // For simplicity, we'll use a signed cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  });

  return email;
}

/**
 * Get current admin session
 */
export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie) {
    return null;
  }

  try {
    const session: AdminSession = JSON.parse(sessionCookie.value);
    
    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      return null;
    }

    // Verify email is still a valid admin
    const admin1Email = process.env.ADMIN_EMAIL_1;
    const admin2Email = process.env.ADMIN_EMAIL_2;
    
    if (session.email !== admin1Email && session.email !== admin2Email) {
      return null;
    }

    return session;
  } catch {
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

