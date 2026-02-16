/**
 * In-memory user store
 * In production, this would be replaced with a database (e.g., PostgreSQL, MongoDB)
 */

import { User, UpgradeRecord } from '@/types/auth';
import { hashPassword } from '@/utils/auth';

// In-memory storage for users
const users: Map<string, User> = new Map();

// In-memory storage for upgrade/payment records
const upgradeRecords: Map<string, UpgradeRecord> = new Map();

// Counter for generating unique IDs
let userIdCounter = 0;
let upgradeIdCounter = 0;

/**
 * Generate a unique user ID
 */
function generateUserId(): string {
  userIdCounter++;
  return `user_${userIdCounter}_${Date.now()}`;
}

/**
 * Generate a unique upgrade record ID
 */
function generateUpgradeId(): string {
  upgradeIdCounter++;
  return `upgrade_${upgradeIdCounter}_${Date.now()}`;
}

/**
 * Initialize default admin user (called on first access)
 */
let initialized = false;
async function ensureInitialized(): Promise<void> {
  if (initialized) return;
  initialized = true;

  // Create a default admin user
  const adminPasswordHash = await hashPassword('admin123');
  const adminUser: User = {
    id: 'admin_default',
    email: 'admin@tarot-online.vn',
    username: 'admin',
    passwordHash: adminPasswordHash,
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  users.set(adminUser.id, adminUser);
}

// --- User CRUD operations ---

/**
 * Find a user by email
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  await ensureInitialized();
  for (const user of users.values()) {
    if (user.email === email) return user;
  }
  return null;
}

/**
 * Find a user by ID
 */
export async function findUserById(id: string): Promise<User | null> {
  await ensureInitialized();
  return users.get(id) || null;
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
  const id = generateUserId();
  const now = new Date().toISOString();
  const user: User = {
    id,
    email,
    username,
    passwordHash,
    role: 'user', // Default role
    createdAt: now,
    updatedAt: now,
  };
  users.set(id, user);
  return user;
}

/**
 * Update a user's role
 */
export async function updateUserRole(
  userId: string,
  role: User['role']
): Promise<User | null> {
  await ensureInitialized();
  const user = users.get(userId);
  if (!user) return null;
  user.role = role;
  user.updatedAt = new Date().toISOString();
  users.set(userId, user);
  return user;
}

/**
 * Get all users (for admin)
 */
export async function getAllUsers(): Promise<User[]> {
  await ensureInitialized();
  return Array.from(users.values());
}

/**
 * Delete a user by ID
 */
export async function deleteUser(userId: string): Promise<boolean> {
  await ensureInitialized();
  return users.delete(userId);
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
  const id = generateUpgradeId();
  const record: UpgradeRecord = {
    id,
    userId,
    fromRole,
    toRole,
    amountVND,
    status: 'completed', // Simulated payment - auto-complete
    createdAt: new Date().toISOString(),
  };
  upgradeRecords.set(id, record);
  return record;
}

/**
 * Get upgrade records for a user
 */
export async function getUpgradeRecordsByUser(userId: string): Promise<UpgradeRecord[]> {
  const records: UpgradeRecord[] = [];
  for (const record of upgradeRecords.values()) {
    if (record.userId === userId) records.push(record);
  }
  return records;
}
