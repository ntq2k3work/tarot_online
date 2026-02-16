/**
 * User data access layer
 * Uses PostgreSQL database for persistent storage
 */

import { User, UpgradeRecord, UserHistory } from '@/types/auth';
import { query, runMigrations } from '@/utils/db';
import { hashPassword } from '@/utils/auth';

// Database row types (snake_case from PostgreSQL)
interface UserRow {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  role: 'user' | 'render' | 'admin';
  phone: string | null;
  token: string | null;
  token_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

interface UpgradeRow {
  id: string;
  user_id: string;
  from_role: string;
  to_role: string;
  amount_vnd: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

interface HistoryRow {
  id: string;
  user_id: string;
  reading_type: string;
  reading_data: Record<string, unknown>;
  created_at: string;
}

/**
 * Convert a database row to a User object
 */
function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    phone: row.phone,
    token: row.token,
    tokenExpiresAt: row.token_expires_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Convert a database row to an UpgradeRecord object
 */
function rowToUpgradeRecord(row: UpgradeRow): UpgradeRecord {
  return {
    id: row.id,
    userId: row.user_id,
    fromRole: row.from_role as UpgradeRecord['fromRole'],
    toRole: row.to_role as UpgradeRecord['toRole'],
    amountVND: row.amount_vnd,
    status: row.status,
    createdAt: row.created_at,
  };
}

/**
 * Convert a database row to a UserHistory object
 */
function rowToHistory(row: HistoryRow): UserHistory {
  return {
    id: row.id,
    userId: row.user_id,
    readingType: row.reading_type,
    readingData: row.reading_data,
    createdAt: row.created_at,
  };
}

/**
 * Ensure database is initialized with migrations and default admin user
 */
let initialized = false;
async function ensureInitialized(): Promise<void> {
  if (initialized) return;
  initialized = true;

  await runMigrations();

  // Create default admin user if not exists
  const existing = await query<UserRow>(
    'SELECT id FROM users WHERE email = $1',
    ['admin@tarot-online.vn']
  );

  if (existing.rows.length === 0) {
    const adminPasswordHash = await hashPassword('admin123');
    await query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, $4)`,
      ['admin', 'admin@tarot-online.vn', adminPasswordHash, 'admin']
    );
  }
}

// --- User CRUD operations ---

/**
 * Find a user by email
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  await ensureInitialized();
  const result = await query<UserRow>(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows.length > 0 ? rowToUser(result.rows[0]) : null;
}

/**
 * Find a user by ID
 */
export async function findUserById(id: string): Promise<User | null> {
  await ensureInitialized();
  const result = await query<UserRow>(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return result.rows.length > 0 ? rowToUser(result.rows[0]) : null;
}

/**
 * Create a new user
 */
export async function createUser(
  email: string,
  username: string,
  passwordHash: string
): Promise<User> {
  await ensureInitialized();
  const result = await query<UserRow>(
    `INSERT INTO users (username, email, password_hash, role)
     VALUES ($1, $2, $3, 'user')
     RETURNING *`,
    [username, email, passwordHash]
  );
  return rowToUser(result.rows[0]);
}

/**
 * Update a user's role
 */
export async function updateUserRole(
  userId: string,
  role: User['role']
): Promise<User | null> {
  await ensureInitialized();
  const result = await query<UserRow>(
    `UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [role, userId]
  );
  return result.rows.length > 0 ? rowToUser(result.rows[0]) : null;
}

/**
 * Get all users (for admin)
 */
export async function getAllUsers(): Promise<User[]> {
  await ensureInitialized();
  const result = await query<UserRow>('SELECT * FROM users ORDER BY created_at DESC');
  return result.rows.map(rowToUser);
}

/**
 * Delete a user by ID
 */
export async function deleteUser(userId: string): Promise<boolean> {
  await ensureInitialized();
  const result = await query('DELETE FROM users WHERE id = $1', [userId]);
  return (result.rowCount ?? 0) > 0;
}

// --- Upgrade record operations ---

/**
 * Create an upgrade payment record
 */
export async function createUpgradeRecord(
  userId: string,
  fromRole: User['role'],
  toRole: User['role'],
  amountVND: number
): Promise<UpgradeRecord> {
  const result = await query<UpgradeRow>(
    `INSERT INTO upgrade_records (user_id, from_role, to_role, amount_vnd, status)
     VALUES ($1, $2, $3, $4, 'completed')
     RETURNING *`,
    [userId, fromRole, toRole, amountVND]
  );
  return rowToUpgradeRecord(result.rows[0]);
}

/**
 * Get upgrade records for a user
 */
export async function getUpgradeRecordsByUser(userId: string): Promise<UpgradeRecord[]> {
  const result = await query<UpgradeRow>(
    'SELECT * FROM upgrade_records WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows.map(rowToUpgradeRecord);
}

// --- User history operations ---

/**
 * Save a reading to user history
 */
export async function createUserHistory(
  userId: string,
  readingType: string,
  readingData: Record<string, unknown>
): Promise<UserHistory> {
  await ensureInitialized();
  const result = await query<HistoryRow>(
    `INSERT INTO user_history (user_id, reading_type, reading_data)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, readingType, JSON.stringify(readingData)]
  );
  return rowToHistory(result.rows[0]);
}

/**
 * Get reading history for a user
 */
export async function getUserHistory(userId: string): Promise<UserHistory[]> {
  await ensureInitialized();
  const result = await query<HistoryRow>(
    'SELECT * FROM user_history WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows.map(rowToHistory);
}

/**
 * Delete a single history record
 */
export async function deleteUserHistory(historyId: string, userId: string): Promise<boolean> {
  await ensureInitialized();
  const result = await query(
    'DELETE FROM user_history WHERE id = $1 AND user_id = $2',
    [historyId, userId]
  );
  return (result.rowCount ?? 0) > 0;
}

/**
 * Delete all history for a user
 */
export async function deleteAllUserHistory(userId: string): Promise<boolean> {
  await ensureInitialized();
  const result = await query(
    'DELETE FROM user_history WHERE user_id = $1',
    [userId]
  );
  return (result.rowCount ?? 0) > 0;
}
