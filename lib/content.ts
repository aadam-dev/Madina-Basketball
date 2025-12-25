// Centralized content management
import { supabase } from './supabase';

export interface ContentSection {
  id?: string;
  page: string;
  section_key: string;
  content: any;
  updated_at?: string;
}

// Helper to get content with fallback
export async function getContent(page: string, section_key: string, fallback: any = ''): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('content_sections')
      .select('content')
      .eq('page', page)
      .eq('section_key', section_key)
      .single();

    if (error || !data) {
      return fallback;
    }

    return data.content;
  } catch (error) {
    console.error(`Error fetching content for ${page}.${section_key}:`, error);
    return fallback;
  }
}

// Get all content for a page
export async function getPageContent(page: string): Promise<Record<string, any>> {
  try {
    const { data, error } = await supabase
      .from('content_sections')
      .select('*')
      .eq('page', page);

    if (error || !data) {
      return {};
    }

    // Convert array to object keyed by section_key
    const contentMap: Record<string, any> = {};
    data.forEach((section: ContentSection) => {
      contentMap[section.section_key] = section.content;
    });

    return contentMap;
  } catch (error) {
    console.error(`Error fetching page content for ${page}:`, error);
    return {};
  }
}

