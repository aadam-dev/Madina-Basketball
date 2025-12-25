import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
console.log('Loading environment from:', envPath);

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('✓ Environment file found');
} else {
  console.error('❌ .env.local file not found');
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl ? '✓ Found' : '❌ Missing');
console.log('Service Role Key:', supabaseServiceRoleKey ? '✓ Found' : '❌ Missing');

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('\n❌ Missing Supabase environment variables');
  console.error('Please ensure .env.local contains:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL');
  console.error('  SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Team members data from the public site
const teamMembers = [
  // Executive Body
  {
    name: "Shafic",
    role: "Executive & Renovation Lead",
    description: "Led stakeholder engagements with community leaders, led fundraising efforts, and sourced support from his network. Instrumental in bringing the vision to life.",
    image_url: "/images/team/shafic.jpg",
    section: "executive",
    order_index: 1,
  },
  {
    name: "Adam",
    role: "Executive & Renovation Lead",
    description: "Sourced contractors, designed dashboards, and tracked the entire renovation project. Co-led the renovation with focus on operations and transparency.",
    image_url: "/images/team/adam.jpg",
    section: "executive",
    order_index: 2,
  },
  {
    name: "Mustafa",
    role: "Executive",
    description: "Member of the executive body driving strategic developments for Madina Basketball.",
    image_url: "/images/team/mustafa.jpg",
    section: "executive",
    order_index: 3,
  },
  {
    name: "Hisham",
    role: "Executive & Coach",
    description: "Member of the executive body driving strategic developments. Also serves as a coach developing players.",
    image_url: "/images/team/hisham.jpg",
    section: "executive",
    order_index: 4,
  },
  {
    name: "Kwame Focus",
    role: "Executive",
    description: "Member of the executive body driving strategic developments for Madina Basketball.",
    image_url: "/images/team/kwame-focus.jpg",
    section: "executive",
    order_index: 5,
  },
  {
    name: "Titus",
    role: "Executive",
    description: "Member of the executive body driving strategic developments for Madina Basketball.",
    image_url: "/images/team/titus.jpg",
    section: "executive",
    order_index: 6,
  },

  // Coaches
  {
    name: "Hisham",
    role: "Coach",
    description: "Developing players and building skills across all levels through training sessions.",
    image_url: "/images/team/hisham.jpg",
    section: "coach",
    order_index: 1,
  },
  {
    name: "Mustafa",
    role: "Coach",
    description: "Leading training sessions and developing players' skills and character.",
    image_url: "/images/team/mustafa.jpg",
    section: "coach",
    order_index: 2,
  },
  {
    name: "Peter",
    role: "Coach",
    description: "Dedicated to player development and skill building in the community.",
    image_url: "/images/team/peter.jpg",
    section: "coach",
    order_index: 3,
  },

  // Maintenance Team
  {
    name: "Kwame Focus",
    role: "Court Maintenance & Oversight",
    description: "Ensuring the court remains in excellent condition and overseeing maintenance operations.",
    image_url: "/images/team/kwame-focus.jpg",
    section: "maintenance",
    order_index: 1,
  },
  {
    name: "Baba",
    role: "Court Maintenance & Oversight",
    description: "Maintaining the court facility and ensuring it remains in top condition for the community.",
    image_url: "/images/team/baba.jpg",
    section: "maintenance",
    order_index: 2,
  },
  {
    name: "Moh",
    role: "Treasurer & Court Maintenance",
    description: "Serving as treasurer managing finances, and also contributing to court maintenance and oversight.",
    image_url: "/images/team/moh.jpg",
    section: "maintenance",
    order_index: 3,
  },
  {
    name: "Adam",
    role: "Court Oversight",
    description: "Overseeing court operations and maintenance as part of his role in the renovation project.",
    image_url: "/images/team/adam.jpg",
    section: "maintenance",
    order_index: 4,
  },

  // Key Stakeholders
  {
    name: "Assemblyman of Madina",
    role: "Key Stakeholder",
    description: "Played a pivotal role in stakeholder engagements to allow the renovation to happen. Facilitated community support and approvals.",
    image_url: "/images/team/assemblyman.jpg",
    section: "stakeholder",
    order_index: 1,
  },
  {
    name: "Thuram",
    role: "Sports Complex Representative",
    description: "Represents the basketball court on the leadership of the Madina Sports Complex, ensuring coordination and integration.",
    image_url: "/images/team/thuram.jpg",
    section: "stakeholder",
    order_index: 2,
  },

  // Media Team
  {
    name: "Adam",
    role: "Media Team",
    description: "Documenting games, events, and community moments to share the Madina Basketball story.",
    image_url: "/images/team/adam.jpg",
    section: "media",
    order_index: 1,
  },
  {
    name: "Jamal",
    role: "Media Team",
    description: "Capturing and sharing the story of Madina Basketball through photos, videos, and content.",
    image_url: "/images/team/jamal.jpg",
    section: "media",
    order_index: 2,
  },
  {
    name: "Mcdwin",
    role: "Media Team",
    description: "Creating and managing visual content to showcase the community and basketball activities.",
    image_url: "/images/team/mcdwin.jpg",
    section: "media",
    order_index: 3,
  },
];

async function seedTeamMembers() {
  console.log('Starting team members seed...');

  // Clear existing data (optional - remove if you want to keep existing data)
  console.log('Clearing existing team members...');
  const { error: deleteError } = await supabase
    .from('team_members')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (deleteError) {
    console.warn('Warning: Could not clear existing data:', deleteError.message);
  }

  // Insert team members
  console.log(`Inserting ${teamMembers.length} team members...`);
  
  for (const member of teamMembers) {
    const { data, error } = await supabase
      .from('team_members')
      .insert(member)
      .select();

    if (error) {
      console.error(`Error inserting ${member.name} (${member.section}):`, error.message);
    } else {
      console.log(`✓ Inserted ${member.name} (${member.section})`);
    }
  }

  console.log('\nSeed completed!');
  console.log(`Total team members: ${teamMembers.length}`);
  
  // Verify the data
  const { data: allMembers, error: countError } = await supabase
    .from('team_members')
    .select('*');

  if (!countError && allMembers) {
    console.log(`\nVerification: ${allMembers.length} team members in database`);
    
    // Group by section
    const sections: Record<string, number> = {};
    allMembers.forEach((member: any) => {
      sections[member.section] = (sections[member.section] || 0) + 1;
    });
    
    console.log('\nBy section:');
    Object.entries(sections).forEach(([section, count]) => {
      console.log(`  ${section}: ${count}`);
    });
  }
}

// Run the seed
seedTeamMembers()
  .then(() => {
    console.log('\n✅ Team members seeded successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  });

