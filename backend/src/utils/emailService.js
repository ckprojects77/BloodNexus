import nodemailer from 'nodemailer'
import logger from './logger.js'

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter()
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"BloodLink" <noreply@bloodlink.app>',
      to,
      subject,
      html,
      text,
    })
    logger.info(`Email sent to ${to}: ${info.messageId}`)
    return info
  } catch (err) {
    logger.error(`Email send failed: ${err.message}`)
    throw err
  }
}

export const sendPasswordResetEmail = async (to, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`
  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:auto">
      <h2 style="color:#DC2626">🩸 BloodLink Password Reset</h2>
      <p>You requested a password reset. Click the button below:</p>
      <a href="${resetUrl}"
         style="display:inline-block;background:#DC2626;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">
        Reset Password
      </a>
      <p style="color:#94a3b8;font-size:12px;margin-top:16px">
        This link expires in 15 minutes. If you didn't request this, ignore this email.
      </p>
    </div>
  `
  return sendEmail({ to, subject: 'BloodLink — Reset Your Password', html })
}

export const sendWelcomeEmail = async (to, name) => {
  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:auto">
      <h2 style="color:#DC2626">🩸 Welcome to BloodLink, ${name}!</h2>
      <p>You're now part of our life-saving emergency blood network.</p>
      <p>Together we can save lives. Thank you for joining.</p>
    </div>
  `
  return sendEmail({ to, subject: 'Welcome to BloodLink!', html })
}
