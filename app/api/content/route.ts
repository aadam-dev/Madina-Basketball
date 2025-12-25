import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET - Get all content sections or filter by page
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');

    let query = supabaseAdmin.from('content_sections').select('*');

    if (page) {
      query = query.eq('page', page);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// PUT - Update content section (upsert)
export async function PUT(request: NextRequest) {
  try {
    await requireAuth(); // Ensure user is authenticated

    const body = await request.json();
    const { page, section_key, content } = body;

    if (!page || !section_key || !content) {
      return NextResponse.json(
        { error: 'Page, section_key, and content are required' },
        { status: 400 }
      );
    }

    // Upsert (insert or update)
    const { data, error } = await supabaseAdmin
      .from('content_sections')
      .upsert(
        {
          page,
          section_key,
          content,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'page,section_key',
        }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

