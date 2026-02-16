/**
 * Booking data access layer
 * Uses PostgreSQL database for persistent storage
 */

import { Booking, BookingStatus, BookingWithUsers } from '@/types/booking';
import { query } from '@/utils/db';

// Database row type (snake_case from PostgreSQL)
interface BookingRow {
  id: string;
  user_id: string;
  reader_id: string;
  scheduled_at: string;
  status: BookingStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface BookingWithUsersRow extends BookingRow {
  user_name: string;
  user_email: string;
  user_phone: string | null;
  reader_name: string;
  reader_email: string;
  reader_phone: string | null;
}

/**
 * Convert a database row to a Booking object
 */
function rowToBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    userId: row.user_id,
    readerId: row.reader_id,
    scheduledAt: row.scheduled_at,
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Convert a database row to a BookingWithUsers object
 */
function rowToBookingWithUsers(row: BookingWithUsersRow): BookingWithUsers {
  return {
    ...rowToBooking(row),
    userName: row.user_name,
    userEmail: row.user_email,
    userPhone: row.user_phone,
    readerName: row.reader_name,
    readerEmail: row.reader_email,
    readerPhone: row.reader_phone,
  };
}

const BOOKING_WITH_USERS_SELECT = `
  b.*,
  u.username AS user_name,
  u.email AS user_email,
  u.phone AS user_phone,
  r.username AS reader_name,
  r.email AS reader_email,
  r.phone AS reader_phone
`;

const BOOKING_WITH_USERS_JOIN = `
  FROM bookings b
  JOIN users u ON b.user_id = u.id
  JOIN users r ON b.reader_id = r.id
`;

/**
 * Create a new booking
 */
export async function createBooking(
  userId: string,
  readerId: string,
  scheduledAt: string,
  notes?: string
): Promise<BookingWithUsers> {
  const result = await query<BookingRow>(
    `INSERT INTO bookings (user_id, reader_id, scheduled_at, notes)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, readerId, scheduledAt, notes || null]
  );

  // Fetch with user details
  return getBookingByIdWithUsers(result.rows[0].id) as Promise<BookingWithUsers>;
}

/**
 * Get a booking by ID with user details
 */
export async function getBookingByIdWithUsers(id: string): Promise<BookingWithUsers | null> {
  const result = await query<BookingWithUsersRow>(
    `SELECT ${BOOKING_WITH_USERS_SELECT} ${BOOKING_WITH_USERS_JOIN} WHERE b.id = $1`,
    [id]
  );
  return result.rows.length > 0 ? rowToBookingWithUsers(result.rows[0]) : null;
}

/**
 * Get a booking by ID (simple)
 */
export async function getBookingById(id: string): Promise<Booking | null> {
  const result = await query<BookingRow>(
    'SELECT * FROM bookings WHERE id = $1',
    [id]
  );
  return result.rows.length > 0 ? rowToBooking(result.rows[0]) : null;
}

/**
 * List bookings for a user (as customer)
 */
export async function getBookingsByUserId(userId: string): Promise<BookingWithUsers[]> {
  const result = await query<BookingWithUsersRow>(
    `SELECT ${BOOKING_WITH_USERS_SELECT} ${BOOKING_WITH_USERS_JOIN}
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC`,
    [userId]
  );
  return result.rows.map(rowToBookingWithUsers);
}

/**
 * List bookings for a reader
 */
export async function getBookingsByReaderId(readerId: string): Promise<BookingWithUsers[]> {
  const result = await query<BookingWithUsersRow>(
    `SELECT ${BOOKING_WITH_USERS_SELECT} ${BOOKING_WITH_USERS_JOIN}
     WHERE b.reader_id = $1
     ORDER BY b.created_at DESC`,
    [readerId]
  );
  return result.rows.map(rowToBookingWithUsers);
}

/**
 * List all bookings (for admin)
 */
export async function getAllBookings(): Promise<BookingWithUsers[]> {
  const result = await query<BookingWithUsersRow>(
    `SELECT ${BOOKING_WITH_USERS_SELECT} ${BOOKING_WITH_USERS_JOIN}
     ORDER BY b.created_at DESC`
  );
  return result.rows.map(rowToBookingWithUsers);
}

/**
 * Update booking status
 */
export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<BookingWithUsers | null> {
  const result = await query<BookingRow>(
    `UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [status, id]
  );
  if (result.rows.length === 0) return null;
  return getBookingByIdWithUsers(id);
}
