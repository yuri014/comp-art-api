interface ICreateEmail {
  username: string;
  recipient: string;
  text: string;
  template: string;
  subject: string;
}

const createEmail = (options: ICreateEmail) => ({
  from: process.env.EMAIL as string,
  to: `${options.username} <${options.recipient}>`,
  subject: options.subject,
  text: options.text,
  html: options.template,
});

export default createEmail;
