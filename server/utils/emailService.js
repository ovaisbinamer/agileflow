// File: server/utils/emailService.js
import nodemailer from 'nodemailer';

// Resend SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  port: 465,
  secure: true,
  auth: {
    user: 'resend',
    pass: process.env.RESEND_API_KEY,
  },
});

/**
 * Send a board invite email.
 * @param {string} to         - recipient email
 * @param {string} boardName  - name of the board
 * @param {string} acceptUrl  - full URL to accept the invite
 * @param {string} inviterName - name of the person who sent the invite
 */
export async function sendInviteEmail(to, boardName, acceptUrl, inviterName = 'Someone') {
  const from = process.env.EMAIL_FROM || 'AgileFlow <noreply@resend.dev>';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body style="margin:0;padding:0;background:#0d0f14;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0f14;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background:#13161e;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#6c63ff,#a855f7);padding:28px 40px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background:rgba(255,255,255,0.15);border-radius:10px;padding:8px 14px;font-size:14px;font-weight:700;color:#fff;font-family:'Courier New',monospace;letter-spacing:1px;">
                        AF
                      </td>
                      <td style="padding-left:12px;font-size:18px;font-weight:700;color:#fff;">
                        AgileFlow
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:40px;">
                  <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#6c63ff;letter-spacing:0.1em;text-transform:uppercase;">Board Invitation</p>
                  <h1 style="margin:0 0 16px;font-size:24px;font-weight:800;color:#e8eaf0;line-height:1.3;">
                    You've been invited to join a board
                  </h1>
                  <p style="margin:0 0 24px;font-size:15px;color:#8b90a7;line-height:1.6;">
                    <strong style="color:#e8eaf0;">${inviterName}</strong> invited you to collaborate on 
                    <strong style="color:#6c63ff;">${boardName}</strong> on AgileFlow.
                  </p>
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="border-radius:12px;background:linear-gradient(135deg,#6c63ff,#a855f7);">
                        <a href="${acceptUrl}" style="display:block;padding:14px 32px;font-size:15px;font-weight:700;color:#fff;text-decoration:none;border-radius:12px;">
                          Accept Invitation →
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin:28px 0 0;font-size:12px;color:#555a72;line-height:1.5;">
                    This link expires in 7 days. If you weren't expecting this invite, you can safely ignore this email.
                  </p>
                  <p style="margin:12px 0 0;font-size:12px;color:#3a3f58;">
                    Or copy this URL: <span style="color:#6c63ff;">${acceptUrl}</span>
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);">
                  <p style="margin:0;font-size:12px;color:#3a3f58;">© ${new Date().getFullYear()} AgileFlow. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from,
    to,
    subject: `${inviterName} invited you to "${boardName}" on AgileFlow`,
    html,
  });
}
