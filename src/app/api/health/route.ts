/**
 * GET /api/health
 * Health check endpoint for monitoring and load balancers
 * Returns application status and dependency health
 */

import { NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { isFeatureConfigured } from '@/utils/env';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  const health: {
    status: 'ok' | 'degraded' | 'error';
    timestamp: string;
    version: string;
    services: Record<string, { status: string; message?: string }>;
  } = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0',
    services: {},
  };

  // Check database connectivity
  try {
    await query('SELECT 1');
    health.services.database = { status: 'ok' };
  } catch (error) {
    health.services.database = {
      status: 'error',
      message: 'Database connection failed',
    };
    health.status = 'error';
    // Log the actual error server-side only (don't expose to client)
    console.error('Health check - DB error:', error);
  }

  // Check external service configuration (not connectivity)
  health.services.gemini = {
    status: isFeatureConfigured('gemini') ? 'configured' : 'not_configured',
  };
  health.services.smtp = {
    status: isFeatureConfigured('smtp') ? 'configured' : 'not_configured',
  };
  health.services.twilio = {
    status: isFeatureConfigured('twilio') ? 'configured' : 'not_configured',
  };

  // If non-critical services are not configured, mark as degraded
  if (
    health.status === 'ok' &&
    !isFeatureConfigured('gemini')
  ) {
    health.status = 'degraded';
  }

  const statusCode = health.status === 'error' ? 503 : 200;
  return NextResponse.json(health, { status: statusCode });
}
