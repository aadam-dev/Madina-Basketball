#!/bin/bash

# Video Compression Script for Development
# This script compresses videos from madpics folder for use during development
# Usage: ./scripts/compress-videos.sh [input_folder] [output_folder]

set -e

INPUT_DIR="${1:-madpics}"
OUTPUT_DIR="${2:-public/videos/compressed}"

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg is not installed. Please install it first:"
    echo "   macOS: brew install ffmpeg"
    echo "   Ubuntu: sudo apt-get install ffmpeg"
    exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "🎬 Starting video compression..."
echo "Input: $INPUT_DIR"
echo "Output: $OUTPUT_DIR"
echo ""

# Compression settings
# -crf 28: Good quality, smaller file size (lower = better quality, 23 is default)
# -preset slow: Better compression, slower encoding
# -vf scale=1280:-1: Scale to 1280px width, maintain aspect ratio
# -movflags +faststart: Enable fast start for web playback

compress_video() {
    local input_file="$1"
    local output_file="$2"
    
    # Get base filename without extension
    local basename=$(basename "$input_file" | sed 's/\.[^.]*$//')
    
    # Skip if output already exists
    if [ -f "$output_file" ]; then
        echo "⏭️  Skipping $basename (already exists)"
        return
    fi
    
    echo "🔄 Compressing: $basename"
    
    ffmpeg -i "$input_file" \
        -vcodec h264 \
        -acodec aac \
        -crf 28 \
        -preset slow \
        -vf "scale=1280:-1" \
        -movflags +faststart \
        -y \
        "$output_file" 2>&1 | grep -E "(Duration|time=|error)" || true
    
    # Get file sizes
    local input_size=$(du -h "$input_file" | cut -f1)
    local output_size=$(du -h "$output_file" | cut -f1)
    
    echo "   ✅ Done: $input_size → $output_size"
    echo ""
}

# Compress specific important videos first
echo "📋 Compressing priority videos..."
echo ""

# Before renovation videos
if [ -f "$INPUT_DIR/videos/before-renovation/before1.MOV" ]; then
    compress_video \
        "$INPUT_DIR/videos/before-renovation/before1.MOV" \
        "$OUTPUT_DIR/before-renovation-1.mp4"
fi

if [ -f "$INPUT_DIR/videos/before-renovation/before2.MOV" ]; then
    compress_video \
        "$INPUT_DIR/videos/before-renovation/before2.MOV" \
        "$OUTPUT_DIR/before-renovation-2.mp4"
fi

# Launch day videos (sample a few)
echo "📋 Compressing launch day videos (sample)..."
for file in "$INPUT_DIR"/IMG_277[0-9].* "$INPUT_DIR"/IMG_278[0-9].*; do
    if [ -f "$file" ] && [[ "$file" =~ \.(MOV|mov|MP4|mp4)$ ]]; then
        basename=$(basename "$file" | sed 's/\.[^.]*$//' | tr '[:upper:]' '[:lower:]')
        compress_video "$file" "$OUTPUT_DIR/launch-day-${basename}.mp4"
        # Limit to first 5 for now
        if [ $(ls -1 "$OUTPUT_DIR"/launch-day-*.mp4 2>/dev/null | wc -l) -ge 5 ]; then
            break
        fi
    fi
done

echo ""
echo "✅ Compression complete!"
echo ""
echo "💡 Next steps:"
echo "   1. Review compressed videos in $OUTPUT_DIR"
echo "   2. Upload important videos to YouTube for production"
echo "   3. Update website to use YouTube embeds or compressed videos"
echo ""
echo "📊 To compress all videos (this will take a while):"
echo "   find $INPUT_DIR -type f \\( -name '*.MOV' -o -name '*.MP4' -o -name '*.mov' -o -name '*.mp4' \\) -exec ./scripts/compress-videos.sh {} $OUTPUT_DIR \\;"

