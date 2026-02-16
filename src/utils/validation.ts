/**
 * Input Validation & Sanitization Utilities
 * Provides reusable validation functions for API endpoints
 * Helps prevent XSS, injection attacks, and invalid data
 */

// --- Sanitization ---

/**
 * Strip HTML tags from a string to prevent XSS
 */
export function sanitizeHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

/**
 * Sanitize a string input: trim whitespace and strip HTML tags
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  return sanitizeHtml(input);
}

// --- Validation ---

/**
 * Validate email format using a strict regex
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 255;
}

/**
 * Validate UUID v4 format
 */
export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Validate a string has minimum and maximum length
 */
export function isValidLength(
  value: string,
  min: number,
  max: number
): boolean {
  return value.length >= min && value.length <= max;
}

/**
 * Validate ISO 8601 date string
 */
export function isValidISODate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

/**
 * Validate that a date is in the future
 */
export function isFutureDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return date > new Date();
}

/**
 * Validate password strength
 * Minimum 6 characters, at least one letter and one number
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 6 && password.length <= 128;
}

/**
 * Validate username: alphanumeric, underscores, 3-50 chars
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF\s]{3,50}$/;
  return usernameRegex.test(username);
}

/**
 * Validate phone number format (Vietnamese or international)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[0-9]{9,15}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

/**
 * Validate that a value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validate notes field (optional, max 1000 chars)
 */
export function isValidNotes(notes: unknown): boolean {
  if (notes === undefined || notes === null || notes === '') return true;
  return typeof notes === 'string' && notes.length <= 1000;
}
