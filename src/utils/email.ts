/**
 * Email Service using Nodemailer
 * Sends email notifications for booking events
 */

import nodemailer from 'nodemailer';

function getTransporter(): nodemailer.Transporter | null {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn('SMTP credentials not configured. Emails will not be sent.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send an email via SMTP
 */
export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.log(`[Email Skipped] To: ${to}, Subject: ${subject}`);
    return false;
  }

  try {
    await transporter.sendMail({
      from: `"Tarot Online" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`[Email Sent] To: ${to}, Subject: ${subject}`);
    return true;
  } catch (error) {
    console.error('[Email Error]', error);
    return false;
  }
}
