import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST || process.env.MAIL_HOST || '';
const smtpPort = Number(process.env.SMTP_PORT || process.env.MAIL_PORT || 587);
const smtpUser = process.env.SMTP_USER || process.env.MAIL_USERNAME || '';
const smtpPass = process.env.SMTP_PASS || process.env.MAIL_PASSWORD || '';
const fromAddress = process.env.SMTP_FROM || process.env.MAIL_FROM_ADDRESS || 'no-reply@easytravellodging.com';
const fromName = process.env.MAIL_FROM_NAME || process.env.APP_NAME || 'Easy Travel Lodging';

const transporter = smtpHost
  ? nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: smtpUser || smtpPass ? { user: smtpUser, pass: smtpPass } : undefined,
      tls: {
        rejectUnauthorized: false,
      },
    })
  : null;

export async function sendTransactionalEmail({
  to,
  subject,
  text,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}) {
  if (!to || !subject || !text) {
    throw new Error('Email requires recipient, subject, and message content.');
  }

  if (!transporter) {
    console.warn('[mailer] SMTP not configured. Email skipped:', { to, subject });
    return { success: false, skipped: true, reason: 'SMTP not configured' };
  }

  try {
    const info = await transporter.sendMail({
      from: `${fromName} <${fromAddress}>`,
      to,
      replyTo,
      subject,
      text,
      html: html || undefined,
    });

    return { success: true, messageId: info.messageId, skipped: false };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown SMTP error';
    console.error('[mailer] Email send failed:', message);
    return { success: false, skipped: false, reason: message };
  }
}
