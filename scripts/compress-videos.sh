#!/bin/bash

# Video Compression Script for Madina Basketball
# Compresses videos for web use while maintaining quality

echo "🎬 Starting video compression..."

# Create compressed directory if it doesn't exist
mkdir -p public/videos/highlights/compressed

# Compress Nader's 3-pointer
if [ -f "public/videos/highlights/nadir-killer-3pointer.mp4" ]; then
  echo "📹 Compressing Nader's 3-pointer..."
  ffmpeg -i public/videos/highlights/nadir-killer-3pointer.mp4 \
    -vcodec libx264 \
    -crf 28 \
    -preset slow \
    -vf "scale=ceil(iw/2)*2:ceil(ih/2)*2" \
    -movflags +faststart \
    -an \
    public/videos/highlights/compressed/nadir-killer-3pointer-compressed.mp4
  
  echo "✅ Nader's 3-pointer compressed"
else
  echo "⚠️  Nader's 3-pointer not found"
fi

# Compress Brandon's coast-to-coast
if [ -f "public/videos/highlights/brandon-coast-to-coast3p.mp4" ]; then
  echo "📹 Compressing Brandon's coast-to-coast..."
  ffmpeg -i public/videos/highlights/brandon-coast-to-coast3p.mp4 \
    -vcodec libx264 \
    -crf 28 \
    -preset slow \
    -vf "scale=ceil(iw/2)*2:ceil(ih/2)*2" \
    -movflags +faststart \
    -an \
    public/videos/highlights/compressed/brandon-coast-to-coast3p-compressed.mp4
  
  echo "✅ Brandon's coast-to-coast compressed"
fi

# Compress Hafiz putback (convert MOV to MP4)
if [ -f "public/videos/highlights/hafiz-putback.mov" ]; then
  echo "📹 Compressing Hafiz putback..."
  ffmpeg -i public/videos/highlights/hafiz-putback.mov \
    -vcodec libx264 \
    -crf 28 \
    -preset slow \
    -vf "scale=ceil(iw/2)*2:ceil(ih/2)*2" \
    -movflags +faststart \
    -an \
    public/videos/highlights/compressed/hafiz-putback-compressed.mp4
  
  echo "✅ Hafiz putback compressed"
fi

# Compress Night of Legends highlights
if [ -f "public/videos/highlights/night-of-legends-highlights.mp4" ]; then
  echo "📹 Compressing Night of Legends highlights..."
  ffmpeg -i public/videos/highlights/night-of-legends-highlights.mp4 \
    -vcodec libx264 \
    -crf 28 \
    -preset slow \
    -vf "scale=ceil(iw/2)*2:ceil(ih/2)*2" \
    -movflags +faststart \
    -an \
    public/videos/highlights/compressed/night-of-legends-highlights-compressed.mp4
  
  echo "✅ Night of Legends highlights compressed"
fi

# Compress Pickup Games highlights
if [ -f "public/videos/highlights/pickup-games-highlights.mp4" ]; then
  echo "📹 Compressing Pickup Games highlights..."
  ffmpeg -i public/videos/highlights/pickup-games-highlights.mp4 \
    -vcodec libx264 \
    -crf 28 \
    -preset slow \
    -vf "scale=ceil(iw/2)*2:ceil(ih/2)*2" \
    -movflags +faststart \
    -an \
    public/videos/highlights/compressed/pickup-games-highlights-compressed.mp4
  
  echo "✅ Pickup Games highlights compressed"
fi

# Compress Training Sessions highlights
if [ -f "public/videos/highlights/training-sessions-highlights.mp4" ]; then
  echo "📹 Compressing Training Sessions highlights..."
  ffmpeg -i public/videos/highlights/training-sessions-highlights.mp4 \
    -vcodec libx264 \
    -crf 28 \
    -preset slow \
    -vf "scale=ceil(iw/2)*2:ceil(ih/2)*2" \
    -movflags +faststart \
    -an \
    public/videos/highlights/compressed/training-sessions-highlights-compressed.mp4
  
  echo "✅ Training Sessions highlights compressed"
fi

# Compress Launch Game highlights
if [ -f "public/videos/highlights/launch-game-highlights.mp4" ]; then
  echo "📹 Compressing Launch Game highlights..."
  ffmpeg -i public/videos/highlights/launch-game-highlights.mp4 \
    -vcodec libx264 \
    -crf 28 \
    -preset slow \
    -vf "scale=ceil(iw/2)*2:ceil(ih/2)*2" \
    -movflags +faststart \
    -an \
    public/videos/highlights/compressed/launch-game-highlights-compressed.mp4
  
  echo "✅ Launch Game highlights compressed"
fi

# Compress Launch Aerial View (convert MOV to MP4)
if [ -f "public/videos/highlights/launch-aerial-view.mov" ]; then
  echo "📹 Compressing Launch Aerial View..."
  ffmpeg -i public/videos/highlights/launch-aerial-view.mov \
    -vcodec libx264 \
    -crf 28 \
    -preset slow \
    -vf "scale=ceil(iw/2)*2:ceil(ih/2)*2" \
    -movflags +faststart \
    -an \
    public/videos/highlights/compressed/launch-aerial-view-compressed.mp4
  
  echo "✅ Launch Aerial View compressed"
fi

# Compress T's Three-Pointer
if [ -f "public/videos/highlights/t-shoots-3-pointer.mp4" ]; then
  echo "📹 Compressing T's Three-Pointer..."
  ffmpeg -i public/videos/highlights/t-shoots-3-pointer.mp4 \
    -vcodec libx264 \
    -crf 28 \
    -preset slow \
    -vf "scale=ceil(iw/2)*2:ceil(ih/2)*2" \
    -movflags +faststart \
    -an \
    public/videos/highlights/compressed/t-shoots-3-pointer-compressed.mp4
  
  echo "✅ T's Three-Pointer compressed"
fi

# Compress Mustafa Drive
if [ -f "public/videos/highlights/mustafa-drive.mp4" ]; then
  echo "📹 Compressing Mustafa Drive..."
  ffmpeg -i public/videos/highlights/mustafa-drive.mp4 \
    -vcodec libx264 \
    -crf 28 \
    -preset slow \
    -vf "scale=ceil(iw/2)*2:ceil(ih/2)*2" \
    -movflags +faststart \
    -an \
    public/videos/highlights/compressed/mustafa-drive-compressed.mp4
  
  echo "✅ Mustafa Drive compressed"
fi

# Compress Night of Legends Warmup
if [ -f "public/videos/highlights/night-of-legends-warmup.mp4" ]; then
  echo "📹 Compressing Night of Legends Warmup..."
  ffmpeg -i public/videos/highlights/night-of-legends-warmup.mp4 \
    -vcodec libx264 \
    -crf 28 \
    -preset slow \
    -vf "scale=ceil(iw/2)*2:ceil(ih/2)*2" \
    -movflags +faststart \
    -an \
    public/videos/highlights/compressed/night-of-legends-warmup-compressed.mp4
  
  echo "✅ Night of Legends Warmup compressed"
fi

echo ""
echo "✅ Compression complete!"
echo "📁 Compressed videos saved to: public/videos/highlights/compressed/"
echo ""
echo "💡 Next steps:"
echo "   1. Review compressed videos"
echo "   2. Replace originals if satisfied"
echo "   3. Update page.tsx to use compressed versions"
