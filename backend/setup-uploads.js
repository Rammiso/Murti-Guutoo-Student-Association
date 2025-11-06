import fs from 'fs';
import path from 'path';

/**
 * Setup Script - Create Upload Directories
 * Run this once to ensure all upload directories exist
 */

const directories = [
  'uploads',
  'uploads/resources',
  'uploads/profiles',
  'uploads/temp'
];

console.log('📁 Creating upload directories...\n');

directories.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✅ Created: ${dirPath}`);
    } else {
      console.log(`✓ Already exists: ${dirPath}`);
    }
  } catch (error) {
    console.error(`❌ Failed to create ${dirPath}:`, error.message);
  }
});

console.log('\n✅ Upload directories setup complete!');
