/**
 * Booking/Appointment Types
 * Defines the data structures for the booking system between Users and Readers
 */

// Booking status enum
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';

// Booking interface stored in the system
export interface Booking {
  id: string;
  userId: string;
  readerId: string;
  scheduledAt: string;
  status: BookingStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// Booking with user and reader details for API responses
export interface BookingWithDetails extends Booking {
  userName: string;
  userEmail: string;
  userPhone: string | null;
  readerName: string;
  readerEmail: string;
  readerPhone: string | null;
}

// Create booking request body
export interface CreateBookingRequest {
  readerId: string;
  scheduledAt: string;
  notes?: string;
}

// Booking list response
export interface BookingListResponse {
  bookings: BookingWithDetails[];
  total: number;
}

// Booking detail response
export interface BookingDetailResponse {
  booking: BookingWithDetails;
}
