const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendMail = async ({ to, subject, html, attachments = [] }) => {
  return transporter.sendMail({
    from: `"Hệ thống điểm danh" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
    attachments, // ✅ QUAN TRỌNG
  });
};

module.exports = { sendMail };
