/**
 * Notification Utilities
 * SMS via Twilio, Email via Nodemailer
 * All notification failures are caught and logged - they do NOT break the booking flow.
 */

import twilio from 'twilio';
import nodemailer from 'nodemailer';
import { BookingWithUsers } from '@/types/booking';

// --- Twilio SMS ---

function getTwilioClient(): twilio.Twilio | null {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) {
    console.warn('[Notification] Twilio credentials not configured. SMS disabled.');
    return null;
  }
  return twilio(accountSid, authToken);
}

/**
 * Send an SMS message via Twilio
 */
async function sendSMS(to: string, body: string): Promise<void> {
  const client = getTwilioClient();
  if (!client) return;

  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!from) {
    console.warn('[Notification] TWILIO_PHONE_NUMBER not configured.');
    return;
  }

  try {
    await client.messages.create({ body, from, to });
    console.log(`[Notification] SMS sent to ${to}`);
  } catch (error) {
    console.error('[Notification] SMS send failed:', error);
  }
}

// --- Nodemailer Email ---

function getEmailTransporter(): nodemailer.Transporter | null {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    console.warn('[Notification] SMTP credentials not configured. Email disabled.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

/**
 * Send an email via Nodemailer
 */
async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const transporter = getEmailTransporter();
  if (!transporter) return;

  const from = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

  try {
    await transporter.sendMail({ from, to, subject, html });
    console.log(`[Notification] Email sent to ${to}`);
  } catch (error) {
    console.error('[Notification] Email send failed:', error);
  }
}

// --- Helper: format date for Vietnamese ---

function formatDateVi(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// --- Booking Notification Functions ---

/**
 * Notify Reader when a new booking is created by a User
 */
export async function notifyReaderNewBooking(booking: BookingWithUsers): Promise<void> {
  const scheduledAt = formatDateVi(booking.scheduledAt);
  const notes = booking.notes ? `\nGhi chú: ${booking.notes}` : '';

  // SMS to Reader
  if (booking.readerPhone) {
    const smsBody =
      `[Tarot Online] Bạn có lịch hẹn mới!\n` +
      `Khách hàng: ${booking.userName}\n` +
      `Thời gian: ${scheduledAt}${notes}\n` +
      `Vui lòng xác nhận hoặc từ chối lịch hẹn.`;
    await sendSMS(booking.readerPhone, smsBody);
  }

  // Email to Reader
  if (booking.readerEmail) {
    const subject = `[Tarot Online] Lịch hẹn mới từ ${booking.userName}`;
    const html = `
      <h2>Bạn có lịch hẹn mới!</h2>
      <p><strong>Khách hàng:</strong> ${booking.userName} (${booking.userEmail})</p>
      <p><strong>Thời gian:</strong> ${scheduledAt}</p>
      ${booking.notes ? `<p><strong>Ghi chú:</strong> ${booking.notes}</p>` : ''}
      <p>Vui lòng đăng nhập để xác nhận hoặc từ chối lịch hẹn.</p>
    `;
    await sendEmail(booking.readerEmail, subject, html);
  }
}

/**
 * Notify User when Reader confirms the booking
 */
export async function notifyUserBookingConfirmed(booking: BookingWithUsers): Promise<void> {
  const scheduledAt = formatDateVi(booking.scheduledAt);

  // SMS to User
  if (booking.userPhone) {
    const smsBody =
      `[Tarot Online] Lịch hẹn đã được xác nhận!\n` +
      `Reader: ${booking.readerName}\n` +
      `Thời gian: ${scheduledAt}\n` +
      `Hẹn gặp bạn!`;
    await sendSMS(booking.userPhone, smsBody);
  }

  // Email to User
  if (booking.userEmail) {
    const subject = `[Tarot Online] Lịch hẹn với ${booking.readerName} đã được xác nhận`;
    const html = `
      <h2>Lịch hẹn đã được xác nhận!</h2>
      <p><strong>Reader:</strong> ${booking.readerName}</p>
      <p><strong>Thời gian:</strong> ${scheduledAt}</p>
      ${booking.notes ? `<p><strong>Ghi chú:</strong> ${booking.notes}</p>` : ''}
      <p>Hẹn gặp bạn!</p>
    `;
    await sendEmail(booking.userEmail, subject, html);
  }
}

/**
 * Notify User when Reader rejects the booking
 */
export async function notifyUserBookingRejected(booking: BookingWithUsers): Promise<void> {
  const scheduledAt = formatDateVi(booking.scheduledAt);

  // SMS to User
  if (booking.userPhone) {
    const smsBody =
      `[Tarot Online] Lịch hẹn đã bị từ chối.\n` +
      `Reader: ${booking.readerName}\n` +
      `Thời gian: ${scheduledAt}\n` +
      `Vui lòng chọn thời gian khác hoặc reader khác.`;
    await sendSMS(booking.userPhone, smsBody);
  }

  // Email to User
  if (booking.userEmail) {
    const subject = `[Tarot Online] Lịch hẹn với ${booking.readerName} đã bị từ chối`;
    const html = `
      <h2>Lịch hẹn đã bị từ chối</h2>
      <p><strong>Reader:</strong> ${booking.readerName}</p>
      <p><strong>Thời gian:</strong> ${scheduledAt}</p>
      <p>Rất tiếc, reader không thể nhận lịch hẹn này. Vui lòng chọn thời gian khác hoặc reader khác.</p>
    `;
    await sendEmail(booking.userEmail, subject, html);
  }
}
