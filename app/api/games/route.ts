/**
 * Games API Route
 * 
 * Handles game management operations:
 * - GET: List games with optional filtering
 * - POST: Create new game (admin only)
 * 
 * Routes:
 * - GET /api/games?status=live&limit=10&mode=basic
 * - POST /api/games (requires authentication)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { handleApiError, ValidationError } from '@/lib/utils/errors';
import { sanitizeString, sanitizeTeamName, isValidDate } from '@/lib/utils/validation';

/**
 * GET - List all games
 * 
 * Query parameters:
 * - status: Filter by status (upcoming, live, completed, cancelled)
 * - limit: Maximum number of results (1-100, default: 50)
 * - mode: Filter by game mode (basic, stats, full)
 * 
 * Returns: Array of game objects
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = sanitizeString(searchParams.get('status') || '');
    const limitParam = searchParams.get('limit');
    const limit = Math.min(Math.max(parseInt(limitParam || '50', 10), 1), 100); // Between 1 and 100
    const mode = sanitizeString(searchParams.get('mode') || '');

    // Validate status if provided
    const validStatuses = ['upcoming', 'live', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Validate mode if provided
    const validModes = ['basic', 'stats', 'full'];
    if (mode && !validModes.includes(mode)) {
      throw new ValidationError(`Invalid mode. Must be one of: ${validModes.join(', ')}`);
    }

    let query = supabaseAdmin
      .from('games')
      .select('*')
      .order('game_date', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    if (mode) {
      query = query.eq('game_mode', mode);
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
 * POST - Create new game
 * 
 * Requires: Admin authentication
 * 
 * Request body:
 * - home_team: string (required) - Home team name
 * - away_team: string (required) - Away team name
 * - home_score: number (default: 0) - Initial home score
 * - away_score: number (default: 0) - Initial away score
 * - quarter: number (default: 1) - Starting quarter
 * - overtime: number (default: 0) - Overtime periods
 * - game_mode: 'basic' | 'stats' | 'full' (default: 'basic')
 * - status: 'upcoming' | 'live' | 'completed' | 'cancelled' (default: 'upcoming')
 * - game_date: string (ISO format) - Game date/time
 * - location: string (default: 'Madina Basketball Court')
 * - notes: string (optional) - Game notes
 * - created_by: string (optional) - Admin email
 * 
 * Returns: Created game object with ID
 */
export async function POST(request: NextRequest) {
  try {
    await requireAuth(); // Ensure user is authenticated

    const body = await request.json();
    let {
      home_team,
      away_team,
      home_score = 0,
      away_score = 0,
      quarter = 1,
      overtime = 0,
      game_mode = 'basic',
      status = 'upcoming',
      game_date,
      location = 'Madina Basketball Court',
      notes,
      created_by,
    } = body;

    // Sanitize and validate inputs
    home_team = sanitizeTeamName(home_team || '');
    away_team = sanitizeTeamName(away_team || '');
    location = sanitizeString(location || 'Madina Basketball Court');
    notes = sanitizeString(notes || '');
    created_by = sanitizeString(created_by || '');

    // Validation
    if (!home_team || home_team.length < 2) {
      throw new ValidationError('Home team is required and must be at least 2 characters');
    }

    if (!away_team || away_team.length < 2) {
      throw new ValidationError('Away team is required and must be at least 2 characters');
    }

    if (home_team.toLowerCase() === away_team.toLowerCase()) {
      throw new ValidationError('Home team and away team must be different');
    }

    // Validate numeric values
    home_score = Math.max(0, Math.floor(Number(home_score) || 0));
    away_score = Math.max(0, Math.floor(Number(away_score) || 0));
    quarter = Math.max(1, Math.min(10, Math.floor(Number(quarter) || 1)));
    overtime = Math.max(0, Math.min(10, Math.floor(Number(overtime) || 0)));

    // Validate game mode
    const validModes = ['basic', 'stats', 'full'];
    if (!validModes.includes(game_mode)) {
      throw new ValidationError(`Invalid game mode. Must be one of: ${validModes.join(', ')}`);
    }

    // Validate status
    const validStatuses = ['upcoming', 'live', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Validate date
    const gameDate = game_date || new Date().toISOString();
    if (!isValidDate(gameDate)) {
      throw new ValidationError('Invalid game date format. Use ISO 8601 format');
    }

    const { data, error } = await supabaseAdmin
      .from('games')
      .insert({
        home_team,
        away_team,
        home_score,
        away_score,
        quarter,
        overtime,
        game_mode,
        status,
        game_date: gameDate,
        location,
        notes: notes || null,
        created_by: created_by || null,
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

