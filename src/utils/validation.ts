/**
 * Input validation utility functions
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validate that a string is a valid UUID v4 format
 */
export function isValidUUID(value: string): boolean {
  return UUID_REGEX.test(value);
}

/**
 * Sanitize a string by trimming whitespace and limiting length
 */
export function sanitizeString(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}

/**
 * Safely parse JSON from a request body, returning null on failure
 */
export async function safeParseJSON(request: Request): Promise<Record<string, unknown> | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
