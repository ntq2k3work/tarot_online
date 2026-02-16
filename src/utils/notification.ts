/**
 * Notification Service
 * Handles sending SMS (via Twilio) and Email (via Nodemailer) notifications
 * Notifications are fire-and-forget: failures are logged but do not break the booking flow
 */

import nodemailer from 'nodemailer';
import twilio from 'twilio';

// --- HTML Escaping for XSS prevention in email templates ---

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- Email Configuration (cached) ---

let cachedTransporter: nodemailer.Transporter | null = null;
let transporterChecked = false;

function getEmailTransporter(): nodemailer.Transporter | null {
  if (transporterChecked) return cachedTransporter;
  transporterChecked = true;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    console.warn('Email notification: SMTP not configured. Skipping email.');
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return cachedTransporter;
}

// --- SMS Configuration (cached) ---

let cachedTwilioClient: twilio.Twilio | null = null;
let twilioChecked = false;

function getTwilioClient(): twilio.Twilio | null {
  if (twilioChecked) return cachedTwilioClient;
  twilioChecked = true;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    console.warn('SMS notification: Twilio not configured. Skipping SMS.');
    return null;
  }

  cachedTwilioClient = twilio(accountSid, authToken);
  return cachedTwilioClient;
}

function getTwilioPhoneNumber(): string | null {
  return process.env.TWILIO_PHONE_NUMBER || null;
}

// --- Send Email ---

async function sendEmail(
  to: string,
  subject: string,
  htmlBody: string
): Promise<void> {
  const transporter = getEmailTransporter();
  if (!transporter) return;

  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

  try {
    await transporter.sendMail({
      from: `"Tarot Online" <${fromEmail}>`,
      to,
      subject,
      html: htmlBody,
    });
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
  }
}

// --- Send SMS ---

async function sendSMS(to: string, body: string): Promise<void> {
  const client = getTwilioClient();
  const from = getTwilioPhoneNumber();

  if (!client || !from) return;

  try {
    await client.messages.create({ body, from, to });
    console.log(`SMS sent successfully to ${to}`);
  } catch (error) {
    console.error(`Failed to send SMS to ${to}:`, error);
  }
}

// --- Notification Templates (Vietnamese) ---

interface BookingNotificationData {
  bookingId: string;
  userName: string;
  readerName: string;
  scheduledAt: string;
  notes?: string | null;
}

function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// --- Public Notification Functions ---

/**
 * Notify reader when a new booking is created
 */
export async function notifyReaderNewBooking(
  readerEmail: string,
  readerPhone: string | null,
  data: BookingNotificationData
): Promise<void> {
  const scheduledFormatted = formatDateTime(data.scheduledAt);
  const safeUserName = escapeHtml(data.userName);
  const safeReaderName = escapeHtml(data.readerName);
  const safeNotes = data.notes ? escapeHtml(data.notes) : null;
  const notesText = data.notes ? `\nGhi chú: ${data.notes}` : '';

  // Send Email
  const emailSubject = `[Tarot Online] Lịch hẹn mới từ ${data.userName}`;
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7c3aed;">🔮 Tarot Online - Lịch hẹn mới</h2>
      <p>Xin chào <strong>${safeReaderName}</strong>,</p>
      <p>Bạn có một lịch hẹn mới từ khách hàng:</p>
      <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Khách hàng</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${safeUserName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Thời gian</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${scheduledFormatted}</td>
        </tr>
        ${safeNotes ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Ghi chú</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${safeNotes}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Mã lịch hẹn</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.bookingId)}</td>
        </tr>
      </table>
      <p>Vui lòng xác nhận hoặc từ chối lịch hẹn này trong hệ thống.</p>
      <p style="color: #666; font-size: 12px;">— Tarot Online</p>
    </div>
  `;

  const smsBody = `[Tarot Online] Lịch hẹn mới từ ${data.userName}. Thời gian: ${scheduledFormatted}.${notesText} Vui lòng xác nhận trong hệ thống.`;

  await Promise.allSettled([
    sendEmail(readerEmail, emailSubject, emailHtml),
    readerPhone ? sendSMS(readerPhone, smsBody) : Promise.resolve(),
  ]);
}

/**
 * Notify user when reader confirms the booking
 */
export async function notifyUserBookingConfirmed(
  userEmail: string,
  userPhone: string | null,
  data: BookingNotificationData
): Promise<void> {
  const scheduledFormatted = formatDateTime(data.scheduledAt);
  const safeUserName = escapeHtml(data.userName);
  const safeReaderName = escapeHtml(data.readerName);

  const emailSubject = `[Tarot Online] Lịch hẹn đã được xác nhận`;
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7c3aed;">🔮 Tarot Online - Xác nhận lịch hẹn</h2>
      <p>Xin chào <strong>${safeUserName}</strong>,</p>
      <p>Lịch hẹn của bạn đã được <strong>${safeReaderName}</strong> xác nhận!</p>
      <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Reader</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${safeReaderName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Thời gian</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${scheduledFormatted}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Mã lịch hẹn</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.bookingId)}</td>
        </tr>
      </table>
      <p>Hãy chuẩn bị sẵn sàng cho buổi đọc bài tarot của bạn!</p>
      <p style="color: #666; font-size: 12px;">— Tarot Online</p>
    </div>
  `;

  const smsBody = `[Tarot Online] Lịch hẹn với ${data.readerName} vào ${scheduledFormatted} đã được xác nhận!`;

  await Promise.allSettled([
    sendEmail(userEmail, emailSubject, emailHtml),
    userPhone ? sendSMS(userPhone, smsBody) : Promise.resolve(),
  ]);
}

/**
 * Notify user when reader rejects the booking
 */
export async function notifyUserBookingRejected(
  userEmail: string,
  userPhone: string | null,
  data: BookingNotificationData
): Promise<void> {
  const scheduledFormatted = formatDateTime(data.scheduledAt);
  const safeUserName = escapeHtml(data.userName);
  const safeReaderName = escapeHtml(data.readerName);

  const emailSubject = `[Tarot Online] Lịch hẹn đã bị từ chối`;
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7c3aed;">🔮 Tarot Online - Lịch hẹn bị từ chối</h2>
      <p>Xin chào <strong>${safeUserName}</strong>,</p>
      <p>Rất tiếc, lịch hẹn của bạn với <strong>${safeReaderName}</strong> vào <strong>${scheduledFormatted}</strong> đã bị từ chối.</p>
      <p>Bạn có thể đặt lịch hẹn khác với reader này hoặc chọn reader khác.</p>
      <p style="color: #666; font-size: 12px;">— Tarot Online</p>
    </div>
  `;

  const smsBody = `[Tarot Online] Lịch hẹn với ${data.readerName} vào ${scheduledFormatted} đã bị từ chối. Vui lòng đặt lịch khác.`;

  await Promise.allSettled([
    sendEmail(userEmail, emailSubject, emailHtml),
    userPhone ? sendSMS(userPhone, smsBody) : Promise.resolve(),
  ]);
}
