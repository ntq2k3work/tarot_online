/**
 * SMS Service using Twilio
 * Sends SMS notifications for booking events
 */

import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

function getClient(): twilio.Twilio | null {
  if (!accountSid || !authToken || !fromPhone) {
    console.warn('Twilio credentials not configured. SMS will not be sent.');
    return null;
  }
  return twilio(accountSid, authToken);
}

export interface SendSmsParams {
  to: string;
  body: string;
}

/**
 * Send an SMS message via Twilio
 */
export async function sendSms({ to, body }: SendSmsParams): Promise<boolean> {
  const client = getClient();
  if (!client) {
    console.log(`[SMS Skipped] To: ${to}, Body: ${body}`);
    return false;
  }

  try {
    await client.messages.create({
      body,
      from: fromPhone,
      to,
    });
    console.log(`[SMS Sent] To: ${to}`);
    return true;
  } catch (error) {
    console.error('[SMS Error]', error);
    return false;
  }
}
