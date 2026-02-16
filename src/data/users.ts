/**
 * User data access layer using PostgreSQL via Prisma
 */

import prisma from '@/lib/prisma';
import { User, UpgradeRecord, UserRole } from '@/types/auth';
import { hashPassword } from '@/utils/auth';
import { UserRole as PrismaUserRole, UpgradeStatus } from '@/generated/prisma';

/**
 * Convert Prisma user to app User type
 */
function toUser(prismaUser: {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  role: PrismaUserRole;
  createdAt: Date;
  updatedAt: Date;
}): User {
  return {
    id: prismaUser.id,
    email: prismaUser.email,
    username: prismaUser.username,
    passwordHash: prismaUser.passwordHash,
    role: prismaUser.role as UserRole,
    createdAt: prismaUser.createdAt.toISOString(),
    updatedAt: prismaUser.updatedAt.toISOString(),
  };
}

/**
 * Convert Prisma upgrade record to app UpgradeRecord type
 */
function toUpgradeRecord(record: {
  id: string;
  userId: string;
  fromRole: PrismaUserRole;
  toRole: PrismaUserRole;
  amountVND: number;
  status: UpgradeStatus;
  createdAt: Date;
}): UpgradeRecord {
  return {
    id: record.id,
    userId: record.userId,
    fromRole: record.fromRole as UserRole,
    toRole: record.toRole as UserRole,
    amountVND: record.amountVND,
    status: record.status as UpgradeRecord['status'],
    createdAt: record.createdAt.toISOString(),
  };
}

/**
 * Ensure default admin user exists (called on first access)
 */
let initialized = false;
async function ensureInitialized(): Promise<void> {
  if (initialized) return;
  initialized = true;

  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@tarot-online.vn' },
  });

  if (!existingAdmin) {
    const adminPasswordHash = await hashPassword('admin123');
    await prisma.user.create({
      data: {
        email: 'admin@tarot-online.vn',
        username: 'admin',
        passwordHash: adminPasswordHash,
        role: 'admin',
      },
    });
  }
}

// --- User CRUD operations ---

/**
 * Find a user by email
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  await ensureInitialized();
  const user = await prisma.user.findUnique({ where: { email } });
  return user ? toUser(user) : null;
}

/**
 * Find a user by ID
 */
export async function findUserById(id: string): Promise<User | null> {
  await ensureInitialized();
  const user = await prisma.user.findUnique({ where: { id } });
  return user ? toUser(user) : null;
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
  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
      role: 'user',
    },
  });
  return toUser(user);
}

/**
 * Update a user's role
 */
export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<User | null> {
  await ensureInitialized();
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: role as PrismaUserRole },
    });
    return toUser(user);
  } catch {
    return null;
  }
}

/**
 * Get all users (for admin)
 */
export async function getAllUsers(): Promise<User[]> {
  await ensureInitialized();
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  return users.map(toUser);
}

/**
 * Delete a user by ID
 */
export async function deleteUser(userId: string): Promise<boolean> {
  await ensureInitialized();
  try {
    await prisma.user.delete({ where: { id: userId } });
    return true;
  } catch {
    return false;
  }
}

// --- Upgrade record operations ---

/**
 * Create an upgrade payment record
 */
export async function createUpgradeRecord(
  userId: string,
  fromRole: UserRole,
  toRole: UserRole,
  amountVND: number
): Promise<UpgradeRecord> {
  const record = await prisma.upgradeRecord.create({
    data: {
      userId,
      fromRole: fromRole as PrismaUserRole,
      toRole: toRole as PrismaUserRole,
      amountVND,
      status: 'completed',
    },
  });
  return toUpgradeRecord(record);
}

/**
 * Get upgrade records for a user
 */
export async function getUpgradeRecordsByUser(userId: string): Promise<UpgradeRecord[]> {
  const records = await prisma.upgradeRecord.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return records.map(toUpgradeRecord);
}
