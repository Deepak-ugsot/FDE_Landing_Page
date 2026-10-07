/**
 * Transactional email helper (used for password resets).
 *
 * If SMTP is configured (SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS), emails are
 * sent for real via nodemailer. Otherwise the app runs in "dev email mode":
 * the message is logged to the server console, and the caller may surface the
 * link in the API response so the flow is testable without an email provider.
 */

const BRAND = 'AI Forward Deployed Engineer';

export const isEmailConfigured = () =>
  Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
  );

const buildResetEmail = ({ name, resetUrl, minutes }) => {
  const firstName = name ? name.split(' ')[0] : 'there';

  const text = `Hi ${firstName},

We received a request to reset the password for your ${BRAND} account.

Reset your password using the link below (valid for ${minutes} minutes):
${resetUrl}

If you didn't request this, you can safely ignore this email — your password won't change.`;

  const html = `<!doctype html>
<html>
  <body style="margin:0;background:#000000;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;background:#121212;border:1px solid #3a3a3a;border-radius:16px;overflow:hidden;">
      <tr><td style="padding:28px 28px 4px;">
        <div style="font-size:18px;font-weight:700;color:#f3efef;">Forward Deployed <span style="color:#e6161f;">Engineer</span></div>
      </td></tr>
      <tr><td style="padding:8px 28px 0;">
        <h1 style="font-size:20px;margin:12px 0;color:#ffffff;">Reset your password</h1>
        <p style="color:#999999;font-size:14px;line-height:1.6;margin:0 0 20px;">Hi ${firstName}, we received a request to reset your password. Tap the button below — this link is valid for ${minutes} minutes.</p>
      </td></tr>
      <tr><td style="padding:0 28px 8px;">
        <a href="${resetUrl}" style="display:inline-block;background:#e6161f;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:13px 26px;border-radius:999px;">Reset password</a>
      </td></tr>
      <tr><td style="padding:18px 28px 28px;">
        <p style="color:#999999;font-size:12px;line-height:1.6;margin:0;">If the button doesn't work, paste this link into your browser:<br/><span style="color:#f23a42;word-break:break-all;">${resetUrl}</span></p>
        <p style="color:#999999;font-size:12px;margin:16px 0 0;">If you didn't request this, you can safely ignore this email.</p>
      </td></tr>
    </table>
  </body>
</html>`;

  return { text, html };
};

export const sendPasswordResetEmail = async ({ to, name, resetUrl, minutes = 60 }) => {
  const subject = `Reset your password — ${BRAND}`;
  const { text, html } = buildResetEmail({ name, resetUrl, minutes });

  if (!isEmailConfigured()) {
    console.log(
      `\n📧 [DEV EMAIL] Password reset link for ${to}:\n   ${resetUrl}\n   (set SMTP_* in .env to send real emails)\n`
    );
    return { sent: false, mock: true };
  }

  // Lazy-import so nodemailer is only needed when SMTP is actually configured.
  const nodemailer = (await import('nodemailer')).default;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"${BRAND}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  });

  return { sent: true, mock: false };
};
