import { log } from 'debug';
import nodemailer from 'nodemailer';

interface IMessage {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

const sendEmail = async (message: IMessage) => {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST_EMAIL,
    port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  transporter.sendMail(message, (error, info) => {
    if (error) {
      log('Error:', error.message);
    }

    log('Message sent: ', info.messageId);

    log('Url: ', nodemailer.getTestMessageUrl(info));
  });
};

export default sendEmail;
