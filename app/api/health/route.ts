/**
 * Health Check API Route
 * 
 * Provides a simple endpoint to check if the application is running.
 * Useful for:
 * - Monitoring services (UptimeRobot, Pingdom, etc.)
 * - Load balancer health checks
 * - Deployment verification
 * 
 * GET /api/health
 * 
 * Returns:
 * - 200: { status: 'ok', timestamp: string, environment: string }
 * - Always returns 200 if the server is running
 */

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health check - server is responding
    return NextResponse.json(
      {
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'unknown',
        version: process.env.npm_package_version || '0.1.0',
      },
      { status: 200 }
    );
  } catch (error) {
    // Even if there's an error, we're still responding (server is up)
    // But we indicate there might be an issue
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'unknown',
      },
      { status: 200 } // Still 200 because server is responding
    );
  }
}

