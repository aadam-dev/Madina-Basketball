/**
 * Events API Route
 * 
 * Handles event management operations:
 * - GET: List events with optional filtering
 * - POST: Create new event (admin only)
 * 
 * Routes:
 * - GET /api/events?status=upcoming&featured=true
 * - POST /api/events (requires authentication)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { handleApiError, ValidationError } from '@/lib/utils/errors';
import { sanitizeString, isValidDate, isValidUrl } from '@/lib/utils/validation';

/**
 * GET - List all events
 * 
 * Query parameters:
 * - status: Filter by status (upcoming, completed, cancelled)
 * - featured: Filter featured events (true/false)
 * 
 * Returns: Array of event objects, ordered by date (ascending)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = sanitizeString(searchParams.get('status') || '');
    const featured = searchParams.get('featured');

    // Validate status if provided
    const validStatuses = ['upcoming', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    let query = supabaseAdmin.from('events').select('*').order('date', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    if (featured === 'true') {
      query = query.eq('featured', true);
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
 * POST - Create new event
 * 
 * Requires: Admin authentication
 * 
 * Request body:
 * - title: string (required, min 3 chars) - Event title
 * - description: string (optional) - Event description
 * - date: string (required, ISO format) - Event date
 * - time: string (optional) - Event time
 * - location: string (optional) - Event location
 * - type: 'game' | 'tournament' | 'training' | 'event' | 'other' (required)
 * - teams: string (optional) - Teams involved
 * - image_url: string (optional, must be valid URL) - Event image
 * - registration_link: string (optional, must be valid URL) - Registration link
 * - status: 'upcoming' | 'completed' | 'cancelled' (default: 'upcoming')
 * - featured: boolean (default: false) - Feature on homepage
 * 
 * Returns: Created event object with ID
 */
export async function POST(request: NextRequest) {
  try {
    await requireAuth(); // Ensure user is authenticated

    const body = await request.json();
    let {
      title,
      description,
      date,
      time,
      location,
      type,
      teams,
      image_url,
      registration_link,
      status = 'upcoming',
      featured = false,
    } = body;

    // Sanitize and validate inputs
    title = sanitizeString(title || '');
    description = sanitizeString(description || '');
    date = sanitizeString(date || '');
    time = sanitizeString(time || '');
    location = sanitizeString(location || '');
    type = sanitizeString(type || '');
    teams = sanitizeString(teams || '');
    image_url = sanitizeString(image_url || '');
    registration_link = sanitizeString(registration_link || '');

    // Validation
    if (!title || title.length < 3) {
      throw new ValidationError('Title is required and must be at least 3 characters');
    }

    if (!date) {
      throw new ValidationError('Date is required');
    }

    if (!isValidDate(date)) {
      throw new ValidationError('Invalid date format. Use ISO 8601 format (YYYY-MM-DD)');
    }

    if (!type) {
      throw new ValidationError('Event type is required');
    }

    const validTypes = ['game', 'tournament', 'training', 'event', 'other'];
    if (!validTypes.includes(type.toLowerCase())) {
      throw new ValidationError(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
    }

    const validStatuses = ['upcoming', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    if (image_url && !isValidUrl(image_url)) {
      throw new ValidationError('Invalid image URL format');
    }

    if (registration_link && !isValidUrl(registration_link)) {
      throw new ValidationError('Invalid registration link URL format');
    }

    const { data, error } = await supabaseAdmin
      .from('events')
      .insert({
        title,
        description: description || null,
        date,
        time: time || null,
        location: location || null,
        type: type.toLowerCase(),
        teams: teams || null,
        image_url: image_url || null,
        registration_link: registration_link || null,
        status: status.toLowerCase(),
        featured: Boolean(featured),
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

