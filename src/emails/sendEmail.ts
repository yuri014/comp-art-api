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
  const transporterOptions = () => {
    if (globalThis.__DEV__) {
      return {
        host: process.env.HOST_EMAIL,
        port: 587,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      };
    }
    return process.env.SMTP;
  };

  const transporter = nodemailer.createTransport(transporterOptions());

  transporter.sendMail(message, (error, info) => {
    if (error) {
      log('Error:', error.message);
      throw new Error();
    }

    log('Message sent: ', info.messageId);

    log('Url: ', nodemailer.getTestMessageUrl(info));
  });
};

export default sendEmail;
