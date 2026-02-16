/**
 * Authentication & Role-based Authorization Types
 */

// Available user roles
export type UserRole = 'user' | 'render' | 'admin';

// User interface stored in the system
export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// Safe user data (without password hash) returned to clients
export interface UserPublic {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// Token payload (returned from token verification)
export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

// Registration request body
export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

// Login request body
export interface LoginRequest {
  email: string;
  password: string;
}

// Auth response with token
export interface AuthResponse {
  token: string;
  user: UserPublic;
}

// Upgrade payment record
export interface UpgradeRecord {
  id: string;
  userId: string;
  fromRole: UserRole;
  toRole: UserRole;
  amountVND: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}
