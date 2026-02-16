/**
 * POST /api/auth/upgrade
 * Upgrade user role from "user" to "render" by paying 50,000 VND
 * Simulates a payment flow: validates user, processes payment, updates role
 * Requires: authenticated user with "user" role
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/utils/auth-middleware';
import { updateUserRole, createUpgradeRecord, getUpgradeRecordsByUser } from '@/data/users';
import { generateToken } from '@/utils/auth';
import { UserPublic } from '@/types/auth';

// Upgrade cost in VND
const UPGRADE_COST_VND = 50000;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate the request
    const { context, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    const user = context!.user;

    // Check if user is already a "render" or "admin"
    if (user.role === 'render') {
      return NextResponse.json(
        { error: 'Bạn đã có vai trò "render". Không cần nâng cấp.' },
        { status: 400 }
      );
    }

    if (user.role === 'admin') {
      return NextResponse.json(
        { error: 'Bạn là admin. Không cần nâng cấp.' },
        { status: 400 }
      );
    }

    // Simulate payment processing
    // In production, this would integrate with a payment gateway (VNPay, MoMo, etc.)
    const paymentSimulation = {
      method: 'simulated',
      amount: UPGRADE_COST_VND,
      currency: 'VND',
      status: 'success',
    };

    // Update user role to "render"
    const updatedUser = await updateUserRole(user.id, 'render');
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Không thể cập nhật vai trò. Vui lòng thử lại.' },
        { status: 500 }
      );
    }

    // Create upgrade/payment record
    const upgradeRecord = await createUpgradeRecord(
      user.id,
      'user',
      'render',
      UPGRADE_COST_VND
    );

    // Generate a new token (old token is invalidated when new one is set)
    const newToken = await generateToken(updatedUser.id);

    return NextResponse.json({
      message: 'Nâng cấp thành công! Bạn đã trở thành "render".',
      payment: paymentSimulation,
      upgradeRecord,
      token: newToken,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        role: updatedUser.role,
        phone: updatedUser.phone,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      } as UserPublic,
    });
  } catch (error) {
    console.error('Upgrade error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi nâng cấp. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/upgrade
 * Get upgrade history for the current user
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { context, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    const records = await getUpgradeRecordsByUser(context!.user.id);
    return NextResponse.json({
      upgradeCostVND: UPGRADE_COST_VND,
      currentRole: context!.user.role,
      canUpgrade: context!.user.role === 'user',
      records,
    });
  } catch (error) {
    console.error('Get upgrade history error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
