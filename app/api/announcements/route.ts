/**
 * Announcements API Route
 * 
 * Handles announcement management operations:
 * - GET: List announcements (public or all for admin)
 * - POST: Create new announcement (admin only)
 * 
 * Routes:
 * - GET /api/announcements?status=active
 * - POST /api/announcements (requires authentication)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { handleApiError, ValidationError } from '@/lib/utils/errors';
import { sanitizeString } from '@/lib/utils/validation';

/**
 * GET - List announcements
 * 
 * Query parameters:
 * - status: Filter by status (active, archived, all)
 * - limit: Maximum number of results (default: 10)
 * 
 * Returns: Array of announcement objects
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = sanitizeString(searchParams.get('status') || 'active');
    const limitParam = searchParams.get('limit');
    const limit = Math.min(Math.max(parseInt(limitParam || '10', 10), 1), 50);

    let query = supabaseAdmin
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    // Filter by status
    if (status !== 'all') {
      query = query.eq('status', status);
    }

    // Only show non-expired active announcements for public
    if (status === 'active') {
      const now = new Date().toISOString();
      query = query.or(`expires_at.is.null,expires_at.gt.${now}`);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data || []);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST - Create new announcement
 * 
 * Requires: Admin authentication
 * 
 * Request body:
 * - title: string (required, min 3 chars)
 * - message: string (required, min 10 chars)
 * - type: 'info' | 'warning' | 'success' | 'event' (default: 'info')
 * - expires_at: string (optional, ISO date)
 * - status: 'active' | 'archived' (default: 'active')
 * 
 * Returns: Created announcement object with ID
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    const body = await request.json();
    let {
      title,
      message,
      type = 'info',
      expires_at,
      status = 'active',
    } = body;

    // Sanitize inputs
    title = sanitizeString(title || '');
    message = sanitizeString(message || '');
    type = sanitizeString(type || 'info');
    status = sanitizeString(status || 'active');

    // Validation
    if (!title || title.length < 3) {
      throw new ValidationError('Title is required and must be at least 3 characters');
    }

    if (!message || message.length < 10) {
      throw new ValidationError('Message is required and must be at least 10 characters');
    }

    const validTypes = ['info', 'warning', 'success', 'event'];
    if (!validTypes.includes(type)) {
      throw new ValidationError(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
    }

    const validStatuses = ['active', 'archived'];
    if (!validStatuses.includes(status)) {
      throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const { data, error } = await supabaseAdmin
      .from('announcements')
      .insert({
        title,
        message,
        type,
        status,
        expires_at: expires_at || null,
        created_by: session.email,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

