/**
 * Notification Service
 * Orchestrates SMS and Email notifications for booking events
 */

import { sendSms } from '@/utils/sms';
import { sendEmail } from '@/utils/email';
import { BookingWithDetails } from '@/types/booking';

/**
 * Notify Reader when a new booking is created by a User
 */
export async function notifyReaderNewBooking(booking: BookingWithDetails): Promise<void> {
  const subject = 'Lịch hẹn mới - Tarot Online';
  const html = `
    <h2>Bạn có lịch hẹn mới!</h2>
    <p><strong>Khách hàng:</strong> ${booking.userName}</p>
    <p><strong>Ngày:</strong> ${booking.scheduledDate}</p>
    <p><strong>Giờ:</strong> ${booking.scheduledTime}</p>
    ${booking.notes ? `<p><strong>Ghi chú:</strong> ${booking.notes}</p>` : ''}
    <p>Vui lòng xác nhận hoặc từ chối lịch hẹn này.</p>
    <br/>
    <p>— Tarot Online</p>
  `;

  const smsBody = `[Tarot Online] Lịch hẹn mới từ ${booking.userName} vào ${booking.scheduledDate} lúc ${booking.scheduledTime}. Vui lòng xác nhận.`;

  await Promise.allSettled([
    sendEmail({ to: booking.readerEmail, subject, html }),
    booking.readerPhone ? sendSms({ to: booking.readerPhone, body: smsBody }) : Promise.resolve(false),
  ]);
}

/**
 * Notify User when Reader confirms the booking
 */
export async function notifyUserBookingConfirmed(booking: BookingWithDetails): Promise<void> {
  const subject = 'Lịch hẹn đã được xác nhận - Tarot Online';
  const html = `
    <h2>Lịch hẹn của bạn đã được xác nhận!</h2>
    <p><strong>Reader:</strong> ${booking.readerName}</p>
    <p><strong>Ngày:</strong> ${booking.scheduledDate}</p>
    <p><strong>Giờ:</strong> ${booking.scheduledTime}</p>
    ${booking.notes ? `<p><strong>Ghi chú:</strong> ${booking.notes}</p>` : ''}
    <p>Hẹn gặp bạn!</p>
    <br/>
    <p>— Tarot Online</p>
  `;

  const smsBody = `[Tarot Online] Lịch hẹn với ${booking.readerName} vào ${booking.scheduledDate} lúc ${booking.scheduledTime} đã được xác nhận!`;

  await Promise.allSettled([
    sendEmail({ to: booking.userEmail, subject, html }),
    booking.userPhone ? sendSms({ to: booking.userPhone, body: smsBody }) : Promise.resolve(false),
  ]);
}

/**
 * Notify User when Reader rejects the booking
 */
export async function notifyUserBookingRejected(booking: BookingWithDetails): Promise<void> {
  const subject = 'Lịch hẹn bị từ chối - Tarot Online';
  const html = `
    <h2>Lịch hẹn của bạn đã bị từ chối</h2>
    <p><strong>Reader:</strong> ${booking.readerName}</p>
    <p><strong>Ngày:</strong> ${booking.scheduledDate}</p>
    <p><strong>Giờ:</strong> ${booking.scheduledTime}</p>
    <p>Rất tiếc, reader không thể nhận lịch hẹn này. Vui lòng thử đặt lịch khác.</p>
    <br/>
    <p>— Tarot Online</p>
  `;

  const smsBody = `[Tarot Online] Lịch hẹn với ${booking.readerName} vào ${booking.scheduledDate} lúc ${booking.scheduledTime} đã bị từ chối.`;

  await Promise.allSettled([
    sendEmail({ to: booking.userEmail, subject, html }),
    booking.userPhone ? sendSms({ to: booking.userPhone, body: smsBody }) : Promise.resolve(false),
  ]);
}

/**
 * Notify Reader when User cancels the booking
 */
export async function notifyReaderBookingCancelled(booking: BookingWithDetails): Promise<void> {
  const subject = 'Lịch hẹn đã bị hủy - Tarot Online';
  const html = `
    <h2>Lịch hẹn đã bị hủy</h2>
    <p><strong>Khách hàng:</strong> ${booking.userName}</p>
    <p><strong>Ngày:</strong> ${booking.scheduledDate}</p>
    <p><strong>Giờ:</strong> ${booking.scheduledTime}</p>
    <p>Khách hàng đã hủy lịch hẹn này.</p>
    <br/>
    <p>— Tarot Online</p>
  `;

  const smsBody = `[Tarot Online] Lịch hẹn từ ${booking.userName} vào ${booking.scheduledDate} lúc ${booking.scheduledTime} đã bị hủy.`;

  await Promise.allSettled([
    sendEmail({ to: booking.readerEmail, subject, html }),
    booking.readerPhone ? sendSms({ to: booking.readerPhone, body: smsBody }) : Promise.resolve(false),
  ]);
}
