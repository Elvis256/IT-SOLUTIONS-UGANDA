const nodemailer = require('nodemailer');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, html, text) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    });
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Email error: ${error.message}`);
    throw error;
  }
};

const sendContactNotification = async (contactData) => {
  const { name, email, phone, location, company, message } = contactData;
  
  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
    <p><strong>Location:</strong> ${location || 'N/A'}</p>
    <p><strong>Company:</strong> ${company || 'N/A'}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `;

  const text = `
    New Contact Form Submission
    Name: ${name}
    Email: ${email}
    Phone: ${phone || 'N/A'}
    Location: ${location || 'N/A'}
    Company: ${company || 'N/A'}
    Message: ${message}
  `;

  return sendEmail(process.env.ADMIN_EMAIL, 'New Contact Form Submission', html, text);
};

const sendContactConfirmation = async (email, name) => {
  const html = `
    <h2>Thank you for contacting IT Solutions Uganda</h2>
    <p>Dear ${name},</p>
    <p>We have received your inquiry and will respond within one business day.</p>
    <p>In the meantime, feel free to explore our services and follow us on social media.</p>
    <p>Best regards,<br>IT Solutions Uganda Team</p>
  `;

  const text = `
    Thank you for contacting IT Solutions Uganda
    
    Dear ${name},
    
    We have received your inquiry and will respond within one business day.
    
    Best regards,
    IT Solutions Uganda Team
  `;

  return sendEmail(email, 'Thank you for contacting us', html, text);
};

module.exports = {
  sendEmail,
  sendContactNotification,
  sendContactConfirmation,
};
