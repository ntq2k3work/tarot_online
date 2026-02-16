/**
 * Next.js Instrumentation
 * Runs once when the server starts up
 * Used for environment validation and startup checks
 */

export async function register(): Promise<void> {
  // Only run on the server side
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { validateEnv } = await import('@/utils/env');
    validateEnv();
  }
}
