/**
 * File Upload API Route
 * 
 * Handles file uploads to Supabase Storage.
 * 
 * POST /api/upload
 * 
 * Requires: Admin authentication
 * 
 * Form data:
 * - file: File (required) - Image file to upload
 * - bucket: string (required) - Storage bucket ('events' or 'team')
 * 
 * Validation:
 * - File type: JPEG, PNG, or WebP only
 * - File size: Maximum 5MB
 * - File extension must match MIME type
 * 
 * Returns:
 * - 200: { url: string, fileName: string } - Upload successful
 * - 400: { error: string } - Validation error
 * - 401: { error: string } - Unauthorized
 * - 500: { error: string } - Upload failed
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { handleApiError, ValidationError } from '@/lib/utils/errors';
import { isValidFileType, isValidFileSize, sanitizeString } from '@/lib/utils/validation';

/**
 * Upload configuration constants
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB maximum file size
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp']; // Allowed MIME types
const ALLOWED_BUCKETS = ['events', 'team']; // Allowed storage buckets

/**
 * Handle file upload request
 * 
 * Process:
 * 1. Authenticate admin user
 * 2. Validate file and bucket parameters
 * 3. Validate file type, size, and extension
 * 4. Generate unique filename to prevent conflicts
 * 5. Upload to Supabase Storage
 * 6. Return public URL for uploaded file
 */
export async function POST(request: NextRequest) {
  try {
    await requireAuth(); // Ensure user is authenticated

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = sanitizeString((formData.get('bucket') as string) || '');

    // Step 1: Validate file is provided
    if (!file) {
      throw new ValidationError('No file provided');
    }

    // Step 2: Validate bucket is allowed
    if (!bucket || !ALLOWED_BUCKETS.includes(bucket)) {
      throw new ValidationError(`Invalid bucket. Must be one of: ${ALLOWED_BUCKETS.join(', ')}`);
    }

    // Step 3: Validate file type (MIME type)
    if (!isValidFileType(file.type, ALLOWED_FILE_TYPES)) {
      throw new ValidationError(
        `Invalid file type. Only ${ALLOWED_FILE_TYPES.map(t => t.split('/')[1].toUpperCase()).join(', ')} are allowed.`
      );
    }

    // Step 4: Validate file size
    if (!isValidFileSize(file.size, MAX_FILE_SIZE)) {
      throw new ValidationError(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
    }

    // Step 5: Validate file extension matches MIME type
    const originalName = sanitizeString(file.name);
    const fileExt = originalName.split('.').pop()?.toLowerCase() || 'jpg';
    
    const extMap: Record<string, string[]> = {
      'image/jpeg': ['jpg', 'jpeg'],
      'image/png': ['png'],
      'image/webp': ['webp'],
    };
    
    if (!extMap[file.type]?.includes(fileExt)) {
      throw new ValidationError('File extension does not match file type');
    }

    // Step 6: Generate unique filename to prevent conflicts
    // Format: {timestamp}-{randomString}.{ext}
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}-${randomString}.${fileExt}`;

    // Step 7: Convert file to buffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Step 8: Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false, // Don't overwrite existing files
      });

    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    // Step 9: Get public URL for the uploaded file
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(bucket).getPublicUrl(fileName);

    return NextResponse.json({
      url: publicUrl,
      fileName: data.path,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

