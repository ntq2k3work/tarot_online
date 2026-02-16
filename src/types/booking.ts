/**
 * Booking/Appointment Types
 */

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';

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

export interface BookingWithUsers extends Booking {
  userName: string;
  userEmail: string;
  userPhone: string | null;
  readerName: string;
  readerEmail: string;
  readerPhone: string | null;
}

export interface CreateBookingRequest {
  readerId: string;
  scheduledAt: string;
  notes?: string;
}
