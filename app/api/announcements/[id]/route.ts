/**
 * Individual Announcement API Route
 * 
 * Handles operations on a specific announcement:
 * - GET: Fetch single announcement
 * - PUT: Update announcement (admin only)
 * - DELETE: Delete announcement (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { handleApiError, ValidationError, NotFoundError } from '@/lib/utils/errors';
import { sanitizeString } from '@/lib/utils/validation';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('announcements')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !data) {
      throw new NotFoundError('Announcement not found');
    }

    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const body = await request.json();
    let {
      title,
      message,
      type,
      expires_at,
      status,
    } = body;

    // Sanitize inputs
    title = sanitizeString(title || '');
    message = sanitizeString(message || '');
    type = sanitizeString(type || '');
    status = sanitizeString(status || '');

    // Build update object
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (title) {
      if (title.length < 3) {
        throw new ValidationError('Title must be at least 3 characters');
      }
      updates.title = title;
    }

    if (message) {
      if (message.length < 10) {
        throw new ValidationError('Message must be at least 10 characters');
      }
      updates.message = message;
    }

    if (type) {
      const validTypes = ['info', 'warning', 'success', 'event'];
      if (!validTypes.includes(type)) {
        throw new ValidationError(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
      }
      updates.type = type;
    }

    if (status) {
      const validStatuses = ['active', 'archived'];
      if (!validStatuses.includes(status)) {
        throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }
      updates.status = status;
    }

    if (expires_at !== undefined) {
      updates.expires_at = expires_at || null;
    }

    const { data, error } = await supabaseAdmin
      .from('announcements')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const { error } = await supabaseAdmin
      .from('announcements')
      .delete()
      .eq('id', params.id);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

