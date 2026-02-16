/**
 * Booking Types for Reader Appointment System
 */

export type BookingStatus = 'pending' | 'confirmed' | 'rejected' | 'cancelled';

export interface Booking {
  id: string;
  userId: string;
  readerId: string;
  scheduledDate: string;
  scheduledTime: string;
  status: BookingStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookingWithDetails extends Booking {
  userName: string;
  userEmail: string;
  userPhone: string | null;
  readerName: string;
  readerEmail: string;
  readerPhone: string | null;
}

export interface CreateBookingRequest {
  readerId: string;
  scheduledDate: string;
  scheduledTime: string;
  notes?: string;
}
