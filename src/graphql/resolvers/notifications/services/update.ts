import { UserInputError } from 'apollo-server-express';

import Notification from '../../../../entities/Notification';
import { IToken } from '../../../../interfaces/Token';

const updateReadNotification = async (user: IToken, notificationID: string) => {
  try {
    await Notification.findOneAndUpdate(
      {
        'notifications._id': notificationID,
        user: user.id,
      },
      {
        $set: { 'notifications.$[el].read': true },
      },
      { useFindAndModify: false, arrayFilters: [{ 'el._id': notificationID }] },
    );
  } catch (error) {
    throw new UserInputError('Não existe essa notificação');
  }

  return true;
};

export default updateReadNotification;
