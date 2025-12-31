#!/usr/bin/env node

/**
 * Media Organization Helper Script
 * 
 * This script helps analyze and organize media files from the madpics folder.
 * Run with: node scripts/organize-media.js
 */

const fs = require('fs');
const path = require('path');

const madpicsDir = path.join(__dirname, '..', 'madpics');
const publicDir = path.join(__dirname, '..', 'public');

// File categorization rules
const categorizeFile = (filename) => {
  const lower = filename.toLowerCase();
  
  // Videos
  if (lower.match(/\.(mov|mp4)$/i)) {
    if (lower.includes('before')) {
      return { category: 'videos', subcategory: 'before-renovation', type: 'video' };
    }
    if (lower.match(/img_277[0-9]|img_278[0-9]/)) {
      return { category: 'videos', subcategory: 'launch-day', type: 'video' };
    }
    if (lower.match(/img_283[0-9]|img_284[0-9]|img_285[0-9]/)) {
      return { category: 'videos', subcategory: 'post-launch-games', type: 'video' };
    }
    if (lower.match(/img_340[0-9]|img_341[0-9]|img_342[0-9]|img_343[0-9]/)) {
      return { category: 'videos', subcategory: 'recent-activity', type: 'video' };
    }
    if (lower.includes('poster') && lower.match(/\.(mp4|mov)$/i)) {
      return { category: 'videos', subcategory: 'promotional', type: 'video' };
    }
    return { category: 'videos', subcategory: 'general', type: 'video' };
  }
  
  // Images
  if (lower.match(/\.(jpg|jpeg|png|heic)$/i)) {
    if (lower.includes('logo')) {
      return { category: 'images', subcategory: 'logo', type: 'image' };
    }
    if (lower.includes('poster') || lower.includes('appreciation')) {
      return { category: 'images', subcategory: 'posters', type: 'image' };
    }
    if (lower.match(/img_277[0-9]|img_278[0-9]/)) {
      return { category: 'images', subcategory: 'launch-day', type: 'image' };
    }
    if (lower.match(/img_283[0-9]|img_284[0-9]|img_285[0-9]/)) {
      return { category: 'images', subcategory: 'post-launch', type: 'image' };
    }
    if (lower.match(/img_340[0-9]|img_341[0-9]|img_342[0-9]|img_343[0-9]/)) {
      return { category: 'images', subcategory: 'recent', type: 'image' };
    }
    return { category: 'images', subcategory: 'general', type: 'image' };
  }
  
  return { category: 'other', subcategory: 'uncategorized', type: 'unknown' };
};

// Analyze files
const analyzeFiles = () => {
  const files = fs.readdirSync(madpicsDir);
  const analysis = {
    videos: { total: 0, byCategory: {}, sizes: [] },
    images: { total: 0, byCategory: {}, sizes: [] },
    other: { total: 0, files: [] }
  };
  
  files.forEach(file => {
    const filePath = path.join(madpicsDir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isFile() && !file.startsWith('.')) {
      const category = categorizeFile(file);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      if (category.type === 'video') {
        analysis.videos.total++;
        analysis.videos.byCategory[category.subcategory] = 
          (analysis.videos.byCategory[category.subcategory] || 0) + 1;
        analysis.videos.sizes.push({ file, size: parseFloat(sizeMB), category: category.subcategory });
      } else if (category.type === 'image') {
        analysis.images.total++;
        analysis.images.byCategory[category.subcategory] = 
          (analysis.images.byCategory[category.subcategory] || 0) + 1;
        analysis.images.sizes.push({ file, size: parseFloat(sizeMB), category: category.subcategory });
      } else {
        analysis.other.total++;
        analysis.other.files.push(file);
      }
    }
  });
  
  return analysis;
};

// Generate organization report
const generateReport = () => {
  console.log('Media Files Analysis Report\n');
  console.log('='.repeat(60));
  
  const analysis = analyzeFiles();
  
  console.log('\nVIDEOS:');
  console.log(`Total: ${analysis.videos.total} files`);
  console.log('\nBy Category:');
  Object.entries(analysis.videos.byCategory)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} files`);
    });
  
  console.log('\nLargest Video Files (>50MB):');
  analysis.videos.sizes
    .filter(v => v.size > 50)
    .sort((a, b) => b.size - a.size)
    .slice(0, 10)
    .forEach(v => {
      console.log(`  ${v.file}: ${v.size}MB (${v.category})`);
    });
  
  console.log('\nIMAGES:');
  console.log(`Total: ${analysis.images.total} files`);
  console.log('\nBy Category:');
  Object.entries(analysis.images.byCategory)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} files`);
    });
  
  console.log('\nLargest Image Files (>2MB):');
  analysis.images.sizes
    .filter(i => i.size > 2)
    .sort((a, b) => b.size - a.size)
    .slice(0, 10)
    .forEach(i => {
      console.log(`  ${i.file}: ${i.size}MB (${i.category})`);
    });
  
  if (analysis.other.total > 0) {
    console.log('\nOTHER FILES:');
    console.log(`Total: ${analysis.other.total} files`);
    analysis.other.files.slice(0, 10).forEach(f => console.log(`  ${f}`));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\nRecommendations:');
  console.log('1. Organize videos by category in madpics/videos/');
  console.log('2. Compress large videos (>50MB) for development use');
  console.log('3. Upload key videos to YouTube for production');
  console.log('4. Convert HEIC images to JPG/PNG for web use');
  console.log('5. Optimize large images (>2MB) before using in website');
};

// Main
if (require.main === module) {
  try {
    generateReport();
  } catch (error) {
    console.error('Error analyzing files:', error);
    process.exit(1);
  }
}

module.exports = { analyzeFiles, categorizeFile };

