import { LeanDocument } from 'mongoose';

import { IUser } from '../interfaces/User';
import createEmail from '../emails/createEmail';
import sendEmail from '../emails/sendEmail';
import confirmationEmailTemplate from '../emails/templates/confirmationEmail';
import ConfirmationCode from '../entities/ConfirmationCode';

const handleSendConfirmationEmail = async (user: IUser | LeanDocument<IUser>) => {
  const confirmationCode = await ConfirmationCode.findOne({ user: user?._id });

  const randomCode = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);

  if (confirmationCode) {
    await confirmationCode.updateOne({ code: randomCode });

    const confirmationEmail = confirmationEmailTemplate(user.username, randomCode.toString());

    const message = createEmail({
      recipient: user.email,
      subject: 'Email de confirmação ✔',
      text: `Confirme seu email, ${user.username}`,
      template: confirmationEmail,
      username: user.username,
    });

    await sendEmail(message);
  } else {
    await ConfirmationCode.findOneAndUpdate(
      {
        user: user?._id,
      },
      { code: randomCode },
      { upsert: true, useFindAndModify: false },
    );

    const confirmationEmail = confirmationEmailTemplate(user.username, randomCode.toString());

    const message = createEmail({
      recipient: user.email,
      subject: 'Email de confirmação ✔',
      text: `Confirme seu email, ${user.username}`,
      template: confirmationEmail,
      username: user.username,
    });

    await sendEmail(message);
  }
};

export default handleSendConfirmationEmail;
