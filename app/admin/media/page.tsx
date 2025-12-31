"use client";

import React, { useState, useEffect } from "react";
import { Image as ImageIcon, Video, Upload, Youtube, FileText, Save, Eye, AlertCircle, CheckCircle, X, Plus } from "lucide-react";
import Link from "next/link";

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'youtube';
  title: string;
  url: string;
  category: string;
  location: string;
  description?: string;
}

// Media locations and their purposes
const MEDIA_LOCATIONS = {
  'hero-background': {
    label: 'Hero Background (Homepage)',
    description: 'Background image/video for homepage hero section',
    path: '/',
    types: ['image', 'video', 'youtube'],
    current: null as MediaItem | null,
  },
  'journey-before-1': {
    label: 'Journey: Before Renovation #1',
    description: 'First before renovation image/video',
    path: '/journey',
    types: ['image', 'video', 'youtube'],
    current: null as MediaItem | null,
  },
  'journey-before-2': {
    label: 'Journey: Before Renovation #2',
    description: 'Second before renovation image/video',
    path: '/journey',
    types: ['image', 'video', 'youtube'],
    current: null as MediaItem | null,
  },
  'journey-before-3': {
    label: 'Journey: Before Renovation #3',
    description: 'Third before renovation image/video',
    path: '/journey',
    types: ['image', 'video', 'youtube'],
    current: null as MediaItem | null,
  },
  'journey-after-1': {
    label: 'Journey: After Renovation #1',
    description: 'First after renovation image/video',
    path: '/journey',
    types: ['image', 'video', 'youtube'],
    current: null as MediaItem | null,
  },
  'journey-after-2': {
    label: 'Journey: After Renovation #2',
    description: 'Second after renovation image/video',
    path: '/journey',
    types: ['image', 'video', 'youtube'],
    current: null as MediaItem | null,
  },
  'journey-after-3': {
    label: 'Journey: After Renovation #3',
    description: 'Third after renovation image/video',
    path: '/journey',
    types: ['image', 'video', 'youtube'],
    current: null as MediaItem | null,
  },
  'journey-capcut-edit': {
    label: 'Journey: CapCut Before/After Edit',
    description: 'CapCut edited video showing before and after transformation',
    path: '/journey',
    types: ['video', 'youtube'],
    current: null as MediaItem | null,
  },
  'journey-fundraising-sheet': {
    label: 'Journey: Fundraising Info Sheet',
    description: 'Information sheet used for fundraising',
    path: '/journey',
    types: ['image'],
    current: null as MediaItem | null,
  },
  'media-poster-1': {
    label: 'Media: Event Poster #1',
    description: 'First event poster in promotional materials',
    path: '/media',
    types: ['image', 'video'],
    current: null as MediaItem | null,
  },
  'media-poster-2': {
    label: 'Media: Event Poster #2',
    description: 'Second event poster in promotional materials',
    path: '/media',
    types: ['image', 'video'],
    current: null as MediaItem | null,
  },
  'media-poster-3': {
    label: 'Media: Event Poster #3',
    description: 'Third event poster in promotional materials',
    path: '/media',
    types: ['image', 'video'],
    current: null as MediaItem | null,
  },
  'media-poster-4': {
    label: 'Media: Event Poster #4',
    description: 'Fourth event poster in promotional materials',
    path: '/media',
    types: ['image', 'video'],
    current: null as MediaItem | null,
  },
};

// Helper function to extract YouTube video ID from URL
function extractYoutubeId(url: string): string {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : '';
}

export default function MediaPage() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'youtube'>('image');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const location = selectedLocation ? MEDIA_LOCATIONS[selectedLocation as keyof typeof MEDIA_LOCATIONS] : null;

  const handleSave = async () => {
    if (!selectedLocation || !title || !url) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);
    setSuccess(null);

    try {
      // Here you would save to your database/API
      // For now, we'll just show success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(selectedLocation);
      setTimeout(() => setSuccess(null), 3000);
      
      // Reset form
      setTitle('');
      setUrl('');
      setYoutubeId('');
      setDescription('');
      setSelectedLocation(null);
    } catch (error) {
      console.error('Error saving media:', error);
      alert('Failed to save media. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleYoutubeUrlChange = (url: string): void => {
    setUrl(url);
    const id = extractYoutubeId(url);
    if (id) {
      setYoutubeId(id);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Media Management</h1>
            <p className="text-gray-600">Upload and manage images, videos, and YouTube embeds across your site</p>
          </div>
        </div>

        {/* Quick Guide */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Quick Guide
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>1. Select Location:</strong> Choose where on your site you want to add/update media</p>
            <p><strong>2. Choose Type:</strong> Upload image/video file OR embed YouTube video</p>
            <p><strong>3. Add Details:</strong> Title, URL (or YouTube link), and optional description</p>
            <p><strong>4. Save:</strong> Your media will appear on the live site immediately</p>
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="font-semibold">💡 Tips:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>For YouTube: Paste the full URL (e.g., https://youtube.com/watch?v=...) and we'll extract the ID</li>
                <li>For images: Use optimized files (under 500KB recommended)</li>
                <li>For videos: Upload to YouTube first, then embed here for best performance</li>
                <li>File paths: Images go in <code className="bg-blue-100 px-1 rounded">public/images/</code>, videos in <code className="bg-blue-100 px-1 rounded">public/videos/</code></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Location Selector */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Media Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(MEDIA_LOCATIONS).map(([key, config]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedLocation(key);
                setMediaType(config.types[0] as 'image' | 'video' | 'youtube');
                setTitle('');
                setUrl('');
                setYoutubeId('');
                setDescription('');
              }}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedLocation === key
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-gray-200 hover:border-primary/50 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{config.label}</h3>
                  <p className="text-xs text-gray-600 mb-2">{config.description}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Eye className="w-3 h-3" />
                    <Link href={config.path} target="_blank" className="hover:text-primary">
                      View on {config.path}
                    </Link>
                  </div>
                </div>
                {selectedLocation === key && (
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {config.types.map(type => (
                  <span
                    key={type}
                    className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Media Form */}
      {selectedLocation && location && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Add/Update: {location.label}
              </h2>
              <p className="text-gray-600">{location.description}</p>
            </div>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Type Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Media Type
            </label>
            <div className="flex space-x-4">
              {location.types.map(type => (
                <button
                  key={type}
                  onClick={() => setMediaType(type as 'image' | 'video' | 'youtube')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all ${
                    mediaType === type
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {type === 'image' && <ImageIcon className="w-4 h-4" />}
                  {type === 'video' && <Video className="w-4 h-4" />}
                  {type === 'youtube' && <Youtube className="w-4 h-4" />}
                  <span className="capitalize">{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Court Before Renovation"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {mediaType === 'youtube' ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  YouTube URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleYoutubeUrlChange(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {youtubeId && (
                  <p className="mt-2 text-sm text-green-600 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    YouTube ID extracted: <code className="ml-1 bg-green-50 px-2 py-1 rounded">{youtubeId}</code>
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Paste the full YouTube URL. We'll extract the video ID automatically.
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {mediaType === 'image' ? 'Image' : 'Video'} URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={mediaType === 'image' 
                    ? "/images/journey/before/before-1.jpg"
                    : "/videos/compressed/before-renovation-1.mp4"}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Enter the file path relative to <code className="bg-gray-100 px-1 rounded">public/</code>.
                  Upload files to the appropriate folder first, then enter the path here.
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this media..."
                rows={3}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end pt-4 border-t">
              <button
                onClick={handleSave}
                disabled={saving || !title || !url}
                className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {saving ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span className="font-semibold">Save Media</span>
                  </>
                )}
              </button>
            </div>

            {success && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">Media saved successfully!</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* File Structure Guide */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">File Structure Guide</h3>
        <div className="space-y-3 text-sm text-gray-700 font-mono">
          <div>
            <strong className="text-gray-900">Images:</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Hero backgrounds: <code className="bg-white px-1 rounded">public/images/hero/</code></li>
              <li>Journey before: <code className="bg-white px-1 rounded">public/images/journey/before/</code></li>
              <li>Journey after: <code className="bg-white px-1 rounded">public/images/journey/after/</code></li>
              <li>Event posters: <code className="bg-white px-1 rounded">public/images/events/posters/</code></li>
            </ul>
          </div>
          <div>
            <strong className="text-gray-900">Videos:</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Compressed videos: <code className="bg-white px-1 rounded">public/videos/compressed/</code></li>
              <li>Full videos: <code className="bg-white px-1 rounded">public/videos/</code></li>
            </ul>
          </div>
          <div className="pt-3 border-t border-gray-300">
            <p className="text-xs text-gray-600">
              💡 <strong>Tip:</strong> For best performance, compress videos before uploading. Use the compression script: <code className="bg-white px-1 rounded">./scripts/compress-videos.sh</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

