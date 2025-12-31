import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
console.log('Loading environment from:', envPath);

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('Environment file found');
} else {
  console.error('Error: .env.local file not found');
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl ? 'Found' : 'Missing');
console.log('Service Role Key:', supabaseServiceRoleKey ? 'Found' : 'Missing');

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('\nError: Missing Supabase environment variables');
  console.error('Please ensure .env.local contains:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL');
  console.error('  SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Team members data from the public site
const teamMembers = [
  // Executive Body
  // Order: Shafic and Adam centered on first row, then Hisham, Kwame, Titus, Mustafa
  {
    name: "Shafic",
    role: "Executive & Renovation Lead",
    description: "Leads stakeholder engagement, fundraising, and community relations for Madina Basketball. Instrumental in securing GHS 44,750 from 18 donors during the court renovation. Manages sponsor relationships and represents the organization in external meetings. Chairs the Finance & Communications Committee.",
    image_url: "/images/team/shafic.jpg",
    section: "executive",
    order_index: 1,
  },
  {
    name: "Adam",
    role: "Executive & Renovation Lead",
    description: "Oversees operations, technology infrastructure, and financial transparency systems. Designed and manages the website, online forms, and all digital systems. Sourced contractors and tracked the entire renovation project. Chairs the Operations Committee with focus on strategic oversight and systems.",
    image_url: "/images/team/adam.jpg",
    section: "executive",
    order_index: 2,
  },
  {
    name: "Hisham",
    role: "Executive & Coach",
    description: "Serves dual role as executive board member and active coach. Focuses on programs, player development, and strategic growth initiatives. Leads training sessions while contributing to organizational strategy and long-term planning.",
    image_url: "/images/team/hisham.jpg",
    section: "executive",
    order_index: 3,
  },
  {
    name: "Kwame Focus",
    role: "Executive",
    description: "Leads daily court operations, maintenance oversight, and event coordination. Serves as primary coach while managing day-to-day facility activities. Bridges executive strategy with on-ground implementation, ensuring smooth court operations.",
    image_url: "/images/team/kwame-focus.jpg",
    section: "executive",
    order_index: 4,
  },
  {
    name: "Titus",
    role: "Executive",
    description: "Focuses on strategic development and sponsorship initiatives. Works on long-term organizational growth, partnership development, and expanding Madina Basketball's reach and impact in the community.",
    image_url: "/images/team/titus.jpg",
    section: "executive",
    order_index: 5,
  },
  {
    name: "Mustafa",
    role: "Executive",
    description: "Oversees community engagement and team coordination. Manages relationships with local basketball teams including Zurak Basketball and Madina Old Gees. Ensures strong connections between the court and the broader Madina community.",
    image_url: "/images/team/mustafa.jpg",
    section: "executive",
    order_index: 6,
  },

  // Coaches
  // Order: Kwame, Hisham, Lord, Jesse
  {
    name: "Kwame Focus",
    role: "Coach",
    description: "Head coach leading overall coaching strategy and training curriculum. Oversees all training sessions, mentors junior coaches, and coordinates with team captains. Brings extensive experience in player development and program management.",
    image_url: "/images/team/kwame-focus.jpg",
    section: "coach",
    order_index: 1,
  },
  {
    name: "Hisham",
    role: "Coach",
    description: "Senior coach with dual executive and coaching responsibilities. Leads training sessions while contributing to strategic program development. Focuses on creating comprehensive player development pathways and coaching excellence.",
    image_url: "/images/team/hisham.jpg",
    section: "coach",
    order_index: 2,
  },
  {
    name: "Lord",
    role: "Coach",
    description: "Active basketball player who brings valuable player perspective to coaching. Volunteers to lead training sessions, implementing the coaching curriculum while maintaining strong connection to the player experience. Focuses on skill development and mentorship.",
    image_url: "/images/team/lord.jpg",
    section: "coach",
    order_index: 3,
  },
  {
    name: "Jesse",
    role: "Coach",
    description: "Experienced coach with professional background including coaching the UPSA team. Both a player and coach, bringing dual perspective to training sessions. Senior coach responsible for implementing training curriculum and mentoring junior coaches.",
    image_url: "/images/team/jesse.jpg",
    section: "coach",
    order_index: 4,
  },

  // Maintenance Team
  {
    name: "Kwame Focus",
    role: "Court Maintenance & Oversight",
    description: "Leads maintenance coordination, scheduling, and equipment management. Primary point person for ensuring the court remains in excellent condition through systematic oversight and proactive facility care.",
    image_url: "/images/team/kwame-focus.jpg",
    section: "maintenance",
    order_index: 1,
  },
  {
    name: "Baba",
    role: "Court Maintenance & Oversight",
    description: "Provides critical 'eyes on court' oversight, managing day-to-day court activities and user interactions. Also serves as referee for games and supports maintenance operations. Ensures the court remains welcoming and well-maintained for all community members.",
    image_url: "/images/team/baba.jpg",
    section: "maintenance",
    order_index: 2,
  },
  {
    name: "Moh",
    role: "Treasurer & Court Oversight",
    description: "Serves as treasurer managing financial operations and record-keeping. Provides ground-level court oversight and historical financial context from the early days of the project. Maintains important institutional knowledge and financial accountability role.",
    image_url: "/images/team/moh.jpg",
    section: "maintenance",
    order_index: 3,
  },
  {
    name: "Adam",
    role: "Court Oversight",
    description: "Provides strategic oversight of court operations and maintenance systems. Manages technology infrastructure for booking, tracking, and facility management. Ensures operational efficiency through systematic coordination and data-driven decision making.",
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
    description: "Manages all digital media platforms and website content. Documents key moments, designs graphics, and maintains the online presence of Madina Basketball. Creates visual narratives that showcase the community impact and court activities.",
    image_url: "/images/team/adam.jpg",
    section: "media",
    order_index: 1,
  },
  {
    name: "Jamal",
    role: "Media Team",
    description: "Active player who captures authentic court moments from a participant's perspective. Creates photo and video content that tells the real story of Madina Basketball's community, combining playing experience with media creation.",
    image_url: "/images/team/jamal.jpg",
    section: "media",
    order_index: 2,
  },
  {
    name: "Mcdwin",
    role: "Media Team",
    description: "Player-turned-media creator who documents games and training sessions. Brings insider perspective to content creation, capturing the energy and authenticity of the basketball community through photos and videos.",
    image_url: "/images/team/mcdwin.jpg",
    section: "media",
    order_index: 3,
  },
  {
    name: "Shvdy Photography",
    role: "Media Team",
    description: "Professional photographer providing high-quality visual documentation of Madina Basketball. Leads the media strategy with stunning imagery that elevates the organization's visual identity. Creates compelling photo stories that capture community spirit and athletic excellence.",
    image_url: "/images/team/shvdy.jpg",
    section: "media",
    order_index: 4,
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
      console.log(`Inserted ${member.name} (${member.section})`);
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
    console.log('\nTeam members seeded successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nSeeding failed:', error);
    process.exit(1);
  });

