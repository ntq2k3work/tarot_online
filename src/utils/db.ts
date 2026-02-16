/**
 * PostgreSQL Database Connection
 * Uses the `pg` library to manage a connection pool
 */

import { Pool, PoolClient } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'tarot_online',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

/**
 * Execute a SQL query using the connection pool
 */
export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<{ rows: T[]; rowCount: number | null }> {
  const result = await pool.query(text, params);
  return { rows: result.rows as T[], rowCount: result.rowCount };
}

/**
 * Get a client from the pool for transactions
 */
export async function getClient(): Promise<PoolClient> {
  return pool.connect();
}

/**
 * Run database migrations to ensure tables exist
 */
export async function runMigrations(): Promise<void> {
  const client = await getClient();
  try {
    await client.query('BEGIN');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'render', 'admin')),
        token VARCHAR(255),
        token_expires_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Create index on email for fast lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
    `);

    // Create index on token for fast auth lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_token ON users (token);
    `);

    // Create user_history table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        reading_type VARCHAR(100) NOT NULL,
        reading_data JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Create index on user_id for fast history lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_history_user_id ON user_history (user_id);
    `);

    // Create upgrade_records table
    await client.query(`
      CREATE TABLE IF NOT EXISTS upgrade_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        from_role VARCHAR(20) NOT NULL,
        to_role VARCHAR(20) NOT NULL,
        amount_vnd INTEGER NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Add phone column to users table (migration 002)
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
    `);

    // Create bookings table (migration 002)
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        reader_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        scheduled_at TIMESTAMPTZ NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
          CHECK (status IN ('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'COMPLETED')),
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Indexes for bookings
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings (user_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_bookings_reader_id ON bookings (reader_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_at ON bookings (scheduled_at);
    `);

    await client.query('COMMIT');
    console.log('Database migrations completed successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Database migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

export default pool;
