/**
 * Environment Variable Validation
 * Validates required environment variables at startup
 * Prevents the application from running with missing critical configuration
 */

interface EnvVar {
  name: string;
  required: boolean;
  description: string;
}

/** List of all environment variables used by the application */
const ENV_VARS: EnvVar[] = [
  // Required for core functionality
  { name: 'DB_HOST', required: true, description: 'PostgreSQL host' },
  { name: 'DB_PORT', required: false, description: 'PostgreSQL port (default: 5432)' },
  { name: 'DB_USER', required: true, description: 'PostgreSQL user' },
  { name: 'DB_PASSWORD', required: true, description: 'PostgreSQL password' },
  { name: 'DB_NAME', required: true, description: 'PostgreSQL database name' },

  // Required for AI interpretation
  { name: 'GEMINI_API_KEY', required: false, description: 'Google Gemini API key for tarot interpretation' },

  // Optional: Notification services
  { name: 'TWILIO_ACCOUNT_SID', required: false, description: 'Twilio Account SID for SMS' },
  { name: 'TWILIO_AUTH_TOKEN', required: false, description: 'Twilio Auth Token for SMS' },
  { name: 'TWILIO_PHONE_NUMBER', required: false, description: 'Twilio phone number for SMS' },
  { name: 'SMTP_HOST', required: false, description: 'SMTP host for email notifications' },
  { name: 'SMTP_PORT', required: false, description: 'SMTP port (default: 587)' },
  { name: 'SMTP_USER', required: false, description: 'SMTP username' },
  { name: 'SMTP_PASSWORD', required: false, description: 'SMTP password' },
  { name: 'SMTP_FROM_EMAIL', required: false, description: 'From email address' },
];

/**
 * Validate all required environment variables are set
 * Logs warnings for optional missing variables
 * Throws an error if any required variable is missing
 */
export function validateEnv(): void {
  const missing: string[] = [];
  const warnings: string[] = [];

  for (const envVar of ENV_VARS) {
    const value = process.env[envVar.name];
    if (!value || value.trim() === '') {
      if (envVar.required) {
        missing.push(`  - ${envVar.name}: ${envVar.description}`);
      } else {
        warnings.push(`  - ${envVar.name}: ${envVar.description}`);
      }
    }
  }

  // Log warnings for optional missing variables
  if (warnings.length > 0) {
    console.warn(
      `⚠️  Optional environment variables not set:\n${warnings.join('\n')}\n` +
      `Some features may be unavailable.`
    );
  }

  // Throw error for required missing variables
  if (missing.length > 0) {
    const message =
      `❌ Missing required environment variables:\n${missing.join('\n')}\n` +
      `Please set these in your .env.local file. See .env.example for reference.`;
    console.error(message);
    // In development, log but don't crash to allow partial functionality
    if (process.env.NODE_ENV === 'production') {
      throw new Error(message);
    }
  }
}

/**
 * Check if a specific feature is configured
 */
export function isFeatureConfigured(feature: 'gemini' | 'twilio' | 'smtp'): boolean {
  switch (feature) {
    case 'gemini':
      return !!process.env.GEMINI_API_KEY;
    case 'twilio':
      return !!(
        process.env.TWILIO_ACCOUNT_SID &&
        process.env.TWILIO_AUTH_TOKEN &&
        process.env.TWILIO_PHONE_NUMBER
      );
    case 'smtp':
      return !!(
        process.env.SMTP_HOST &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASSWORD
      );
    default:
      return false;
  }
}
