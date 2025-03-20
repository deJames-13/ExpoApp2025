import * as env from '#config';
import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  var transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `${env.SMTP_FROM_NAME} <${env.SMTP_FROM_EMAIL}>`,
    to: options?.email || 'No email provided!',
    subject: options?.subject || '',
    html: `${options?.html || options?.message || ''}`,
  };

  await transport.sendMail(mailOptions);
};

