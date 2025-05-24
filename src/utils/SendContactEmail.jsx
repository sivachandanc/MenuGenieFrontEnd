import nodemailer from "nodemailer";

export async function sendContactEmail({ name, email, message }) {
  const transporter = nodemailer.createTransport({
    host: import.meta.env.VITE_SMTP_SERVER, // e.g., smtp.gmail.com
    port: 587,
    secure: false, // true for port 465
    auth: {
      user: import.meta.env.VITE_SMTP_USER, // Use env vars for safety
      pass: import.meta.env.VITE_SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Menu Genie Contact" <${import.meta.env.VITE_SMTP_USER}>`,
    to: "your@email.com",
    subject: `Contact Form: ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  return info.messageId;
}
