/**
 * Video configuration for YouTube embeds
 * Replace videoId values with actual YouTube video IDs after uploading
 */

export interface VideoConfig {
  videoId: string;
  title: string;
  category: string;
  date?: string;
}

export const videos: Record<string, VideoConfig> = {
  // Before Renovation
  'before-renovation-1': {
    videoId: '', // Add YouTube ID after uploading before1.MOV
    title: 'Court Before Renovation - Part 1',
    category: 'before-renovation',
    date: '2025-07-14',
  },
  'before-renovation-2': {
    videoId: '', // Add YouTube ID after uploading before2.MOV
    title: 'Court Before Renovation - Part 2',
    category: 'before-renovation',
    date: '2025-07-14',
  },
  
  // Launch Day
  'launch-day-opening': {
    videoId: '', // Add YouTube ID after uploading launch day video
    title: 'Court Launch Opening Ceremony',
    category: 'launch-day',
    date: '2025-06-22',
  },
  'launch-day-game': {
    videoId: '', // Add YouTube ID after uploading launch game video
    title: 'Launch Day Game: Madina vs Kawukudi',
    category: 'launch-day',
    date: '2025-06-22',
  },
  
  // Games
  'madina-vs-nima': {
    videoId: '', // Add YouTube ID if available
    title: 'Madina vs Nima Basketball Match',
    category: 'games',
  },
  
  // CapCut Edit
  'capcut-edit': {
    videoId: '', // Add YouTube ID after uploading CapCut edit
    title: 'Before & After Transformation - CapCut Edit',
    category: 'journey',
    date: '2025-06-22',
  },
};

/**
 * Get video by key
 */
export function getVideo(key: string): VideoConfig | undefined {
  return videos[key];
}

/**
 * Get all videos by category
 */
export function getVideosByCategory(category: string): VideoConfig[] {
  return Object.values(videos).filter(v => v.category === category);
}

/**
 * Get all videos
 */
export function getAllVideos(): VideoConfig[] {
  return Object.values(videos);
}

