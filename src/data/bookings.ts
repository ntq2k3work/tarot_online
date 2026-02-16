/**
 * Booking data access layer
 * Uses PostgreSQL database for persistent storage
 */

import { Booking, BookingStatus, BookingWithDetails } from '@/types/booking';
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

// Booking row with joined user/reader details
interface BookingDetailRow extends BookingRow {
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
 * Convert a detail row to a BookingWithDetails object
 */
function rowToBookingWithDetails(row: BookingDetailRow): BookingWithDetails {
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

// SQL fragment for joining user and reader details
const BOOKING_DETAIL_SELECT = `
  b.*,
  u.username AS user_name,
  u.email AS user_email,
  u.phone AS user_phone,
  r.username AS reader_name,
  r.email AS reader_email,
  r.phone AS reader_phone
`;

const BOOKING_DETAIL_FROM = `
  bookings b
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
): Promise<BookingWithDetails> {
  const result = await query<BookingRow>(
    `INSERT INTO bookings (user_id, reader_id, scheduled_at, notes)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, readerId, scheduledAt, notes || null]
  );

  // Fetch with details
  return getBookingById(result.rows[0].id) as Promise<BookingWithDetails>;
}

/**
 * Get a booking by ID with user/reader details
 */
export async function getBookingById(
  bookingId: string
): Promise<BookingWithDetails | null> {
  const result = await query<BookingDetailRow>(
    `SELECT ${BOOKING_DETAIL_SELECT} FROM ${BOOKING_DETAIL_FROM} WHERE b.id = $1`,
    [bookingId]
  );
  return result.rows.length > 0 ? rowToBookingWithDetails(result.rows[0]) : null;
}

/**
 * List bookings for a user (as customer)
 */
export async function getBookingsByUserId(
  userId: string
): Promise<BookingWithDetails[]> {
  const result = await query<BookingDetailRow>(
    `SELECT ${BOOKING_DETAIL_SELECT} FROM ${BOOKING_DETAIL_FROM}
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC`,
    [userId]
  );
  return result.rows.map(rowToBookingWithDetails);
}

/**
 * List bookings for a reader
 */
export async function getBookingsByReaderId(
  readerId: string
): Promise<BookingWithDetails[]> {
  const result = await query<BookingDetailRow>(
    `SELECT ${BOOKING_DETAIL_SELECT} FROM ${BOOKING_DETAIL_FROM}
     WHERE b.reader_id = $1
     ORDER BY b.created_at DESC`,
    [readerId]
  );
  return result.rows.map(rowToBookingWithDetails);
}

/**
 * List all bookings (for admin)
 */
export async function getAllBookings(): Promise<BookingWithDetails[]> {
  const result = await query<BookingDetailRow>(
    `SELECT ${BOOKING_DETAIL_SELECT} FROM ${BOOKING_DETAIL_FROM}
     ORDER BY b.created_at DESC`
  );
  return result.rows.map(rowToBookingWithDetails);
}

/**
 * Update booking status
 */
export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
): Promise<BookingWithDetails | null> {
  const result = await query<BookingRow>(
    `UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [status, bookingId]
  );

  if (result.rows.length === 0) return null;
  return getBookingById(bookingId);
}
