#!/usr/bin/env tsx
/**
 * One-time content seeding script
 * Extracts hardcoded content from pages and populates the database
 * 
 * Run with: npx tsx scripts/seed-content.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Content to seed - extracted from current pages
const contentSections = [
  // Homepage content
  {
    page: 'home',
    section_key: 'hero_title',
    content: 'MADINA\nBASKETBALL',
  },
  {
    page: 'home',
    section_key: 'hero_subtitle',
    content: 'A Community-Built Court, Now Active',
  },
  {
    page: 'home',
    section_key: 'hero_description',
    content: 'From a broken public court to a fully renovated basketball hub in Libya Quarters, Madina, Accra. Built by the community, for the community.',
  },
  {
    page: 'home',
    section_key: 'hero_location',
    content: 'Libya Quarters, Madina, Accra, Ghana',
  },
  {
    page: 'home',
    section_key: 'stats_amount_raised',
    content: 'GHS 44,750',
  },
  {
    page: 'home',
    section_key: 'stats_players',
    content: '150+',
  },
  {
    page: 'home',
    section_key: 'stats_events',
    content: '12+',
  },
  {
    page: 'home',
    section_key: 'mission_title',
    content: 'Basketball for Everyone',
  },
  {
    page: 'home',
    section_key: 'mission_text_1',
    content: 'Madina has always had a basketball-playing population, but never had a standard public court. When the Libya Quarters court fell into disrepair, the community came together to change that.',
  },
  {
    page: 'home',
    section_key: 'mission_text_2',
    content: 'Through transparent fundraising, professional planning, and grassroots effort, we transformed a neglected space into an active sports hub for youth development, pick-up games, and community events.',
  },
  {
    page: 'home',
    section_key: 'cta_title',
    content: 'Ready to Ball?',
  },
  {
    page: 'home',
    section_key: 'cta_description',
    content: 'The court is open. The community is waiting. Come be part of something real.',
  },

  // About page content
  {
    page: 'about',
    section_key: 'title',
    content: 'About the Project',
  },
  {
    page: 'about',
    section_key: 'intro',
    content: 'Understanding why this matters and how we got here',
  },

  // Journey page content
  {
    page: 'journey',
    section_key: 'title',
    content: 'The Journey',
  },
  {
    page: 'journey',
    section_key: 'intro',
    content: 'The complete story of how a community transformed a neglected court into an active basketball hub. This is our documented journey — every step, every decision, every milestone.',
  },

  // Contact & Footer content
  {
    page: 'contact',
    section_key: 'email',
    content: 'themadinacourt@gmail.com',
  },
  {
    page: 'contact',
    section_key: 'whatsapp',
    content: '233XXXXXXXXX',
  },
  {
    page: 'contact',
    section_key: 'location',
    content: 'Libya Quarters, Madina, Accra, Ghana',
  },
  {
    page: 'contact',
    section_key: 'facebook_url',
    content: 'https://facebook.com/madinabasketball',
  },
  {
    page: 'contact',
    section_key: 'instagram_url',
    content: 'https://instagram.com/madinabasketball',
  },
  {
    page: 'contact',
    section_key: 'footer_about',
    content: 'A community-built basketball court in Libya Quarters, Madina (Accra, Ghana). Built by the community, for the community.',
  },
];

async function seedContent() {
  console.log('🌱 Starting content seeding...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const section of contentSections) {
    try {
      const { data, error } = await supabase
        .from('content_sections')
        .upsert(
          {
            page: section.page,
            section_key: section.section_key,
            content: section.content,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'page,section_key',
          }
        )
        .select();

      if (error) {
        console.error(`❌ Error seeding ${section.page}.${section.section_key}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Seeded: ${section.page}.${section.section_key}`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Exception seeding ${section.page}.${section.section_key}:`, err);
      errorCount++;
    }
  }

  console.log(`\n🎉 Seeding complete!`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Errors: ${errorCount}`);
  console.log(`\n💡 You can now manage all content through the admin portal at /admin/content`);
}

// Run the seeding
seedContent()
  .then(() => {
    console.log('\n✨ All done! Database is populated.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });

