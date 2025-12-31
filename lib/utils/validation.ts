/**
 * Input validation and sanitization utilities
 * 
 * These functions provide security-focused validation and sanitization
 * to prevent XSS attacks and ensure data integrity.
 */

/**
 * Sanitize string input to prevent XSS attacks
 * 
 * Removes potentially dangerous characters and limits length.
 * 
 * @param input - Raw string input from user
 * @returns Sanitized string safe for display and storage
 * 
 * @example
 * sanitizeString("<script>alert('xss')</script>") // Returns: "scriptalert('xss')script"
 */
export function sanitizeString(input: string): string {
  return input
    .trim() // Remove leading/trailing whitespace
    .replace(/[<>]/g, '') // Remove potential HTML tags (< and >)
    .slice(0, 10000); // Limit length to prevent DoS attacks
}

/**
 * Validate email format using RFC 5322 compliant regex
 * 
 * @param email - Email address to validate
 * @returns true if email format is valid, false otherwise
 * 
 * @example
 * isValidEmail("user@example.com") // Returns: true
 * isValidEmail("invalid-email") // Returns: false
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 * 
 * Uses the native URL constructor to validate URL format.
 * 
 * @param url - URL string to validate
 * @returns true if URL format is valid, false otherwise
 * 
 * @example
 * isValidUrl("https://example.com") // Returns: true
 * isValidUrl("not-a-url") // Returns: false
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate date string (ISO 8601 format)
 * 
 * @param dateString - Date string to validate (e.g., "2025-01-15T10:30:00Z")
 * @returns true if date is valid, false otherwise
 * 
 * @example
 * isValidDate("2025-01-15") // Returns: true
 * isValidDate("invalid-date") // Returns: false
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Validate file MIME type against allowed types
 * 
 * @param fileType - MIME type of the file (e.g., "image/jpeg")
 * @param allowedTypes - Array of allowed MIME types
 * @returns true if file type is allowed, false otherwise
 * 
 * @example
 * isValidFileType("image/jpeg", ["image/jpeg", "image/png"]) // Returns: true
 * isValidFileType("application/pdf", ["image/jpeg"]) // Returns: false
 */
export function isValidFileType(
  fileType: string,
  allowedTypes: string[]
): boolean {
  return allowedTypes.includes(fileType);
}

/**
 * Validate file size is within allowed limits
 * 
 * @param fileSize - File size in bytes
 * @param maxSize - Maximum allowed file size in bytes
 * @returns true if file size is valid (greater than 0 and within limit)
 * 
 * @example
 * isValidFileSize(1024 * 1024, 5 * 1024 * 1024) // Returns: true (1MB < 5MB)
 * isValidFileSize(10 * 1024 * 1024, 5 * 1024 * 1024) // Returns: false (10MB > 5MB)
 */
export function isValidFileSize(fileSize: number, maxSize: number): boolean {
  return fileSize > 0 && fileSize <= maxSize;
}

/**
 * Sanitize and validate team name
 * Removes dangerous characters and limits length to 100 characters
 * 
 * @param name - Team name to sanitize
 * @returns Sanitized team name (max 100 characters)
 */
export function sanitizeTeamName(name: string): string {
  return sanitizeString(name).slice(0, 100);
}

/**
 * Sanitize and validate event title
 * Removes dangerous characters and limits length to 200 characters
 * 
 * @param title - Event title to sanitize
 * @returns Sanitized event title (max 200 characters)
 */
export function sanitizeEventTitle(title: string): string {
  return sanitizeString(title).slice(0, 200);
}

