-- Migration: 001_initial_schema
-- Description: Create initial database tables for Tarot Online
-- Date: 2026-02-16

-- Users table
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

-- Index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- Index on token for fast auth lookups
CREATE INDEX IF NOT EXISTS idx_users_token ON users (token);

-- User history table (tarot reading history)
CREATE TABLE IF NOT EXISTS user_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reading_type VARCHAR(100) NOT NULL,
  reading_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on user_id for fast history lookups
CREATE INDEX IF NOT EXISTS idx_user_history_user_id ON user_history (user_id);

-- Upgrade records table (payment/role upgrade history)
CREATE TABLE IF NOT EXISTS upgrade_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  from_role VARCHAR(20) NOT NULL,
  to_role VARCHAR(20) NOT NULL,
  amount_vnd INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
