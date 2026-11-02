import { sendTransactionalEmail } from './mailer.js';

export type AdminNotificationKind =
  | 'payment_verified'
  | 'payment_rejected'
  | 'order_received'
  | 'inquiry_new'
  | 'booking_created'
  | 'welcome_user';

function getFromAddress() {
  return process.env.SMTP_FROM || process.env.MAIL_FROM_ADDRESS || 'easytravelagency@trustagent.space';
}

function getFromName() {
  return process.env.MAIL_FROM_NAME || process.env.APP_NAME || 'Easy Travel Lodging';
}

export async function sendAdminNotification({
  to,
  subject,
  message,
  customerName,
  details,
}: {
  to: string;
  subject: string;
  message: string;
  customerName?: string;
  details?: string[];
}) {
  if (!to) return { success: false, skipped: true, reason: 'missing-recipient' };

  const lines = details && details.length > 0 ? details : [message];
  const text = [
    `Easy Travel Lodging Admin Notification`,
    '',
    customerName ? `Customer: ${customerName}` : 'Customer: N/A',
    `Subject: ${subject}`,
    '',
    message,
    '',
    ...lines.map((line) => `- ${line}`),
    '',
    `Sent from ${getFromName()}`,
  ].join('\n');

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:640px;margin:0 auto;">
      <h2 style="margin:0 0 12px;color:#111827;">${subject}</h2>
      <p style="margin:0 0 12px;"><strong>Customer:</strong> ${customerName || 'N/A'}</p>
      <p style="margin:0 0 12px;">${message}</p>
      <ul style="margin:0 0 16px;padding-left:18px;">
        ${lines.map((line) => `<li>${line}</li>`).join('')}
      </ul>
      <p style="margin:0;color:#374151;">Sent from ${getFromName()} • ${getFromAddress()}</p>
    </div>
  `;

  return sendTransactionalEmail({
    to,
    subject,
    text,
    html,
    replyTo: getFromAddress(),
  });
}

export async function sendUserNotification({
  to,
  name,
  subject,
  intro,
  details,
}: {
  to: string;
  name?: string;
  subject: string;
  intro: string;
  details: string[];
}) {
  if (!to) return { success: false, skipped: true, reason: 'missing-recipient' };

  const displayName = name?.trim() || 'Guest';
  const lines = details.length > 0 ? details : ['Thank you for reaching out to Easy Travel Lodging.'];
  const text = [
    `Hello ${displayName},`,
    '',
    intro,
    '',
    ...lines.map((line) => `- ${line}`),
    '',
    'Warm regards,',
    'Easy Travel Lodging Team',
    '',
    `Reply to: ${getFromAddress()}`,
  ].join('\n');

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#282828;max-width:640px;margin:0 auto;">
      <h2 style="margin:0 0 12px;color:#1f2937;">${subject}</h2>
      <p style="margin:0 0 12px;">Hello ${displayName},</p>
      <p style="margin:0 0 12px;">${intro}</p>
      <ul style="margin:0 0 16px;padding-left:18px;">
        ${lines.map((line) => `<li>${line}</li>`).join('')}
      </ul>
      <p style="margin:0;">Warm regards,<br />Easy Travel Lodging Team</p>
      <p style="margin-top:16px;color:#6b7280;">Reply to: ${getFromAddress()}</p>
    </div>
  `;

  return sendTransactionalEmail({
    to,
    subject,
    text,
    html,
    replyTo: getFromAddress(),
  });
}
