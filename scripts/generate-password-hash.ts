/**
 * Utility script to generate bcrypt hashes for admin passwords
 * 
 * Usage:
 *   tsx scripts/generate-password-hash.ts <password>
 * 
 * This will output a bcrypt hash that can be used in .env.local as:
 *   ADMIN_PASSWORD_1_HASH=<generated_hash>
 */

import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Usage: tsx scripts/generate-password-hash.ts <password>');
  process.exit(1);
}

async function generateHash() {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  
  console.log('\nPassword hash generated:');
  console.log(hash);
  console.log('\nAdd this to your .env.local file:');
  console.log(`ADMIN_PASSWORD_1_HASH=${hash}`);
  console.log('(or ADMIN_PASSWORD_2_HASH for the second admin)\n');
}

generateHash().catch((error) => {
  console.error('Error generating hash:', error);
  process.exit(1);
});

