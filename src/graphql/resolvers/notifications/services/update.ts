import { PubSub, UserInputError } from 'apollo-server-express';

import User from '../../../../entities/User';
import Notification from '../../../../entities/Notification';

type NotificationOptions = {
  title: string;
  body: string;
  link: string;
  username: string;
};

const createNotification = async (options: NotificationOptions, pubsub: PubSub) => {
  const user = await User.findOne({ username: options.username });

  if (!user) {
    throw new UserInputError('Não há usuário');
  }

  const notification = await Notification.findOneAndUpdate(
    { user: user.id },
    {
      $push: {
        notifications: {
          $position: 0,
          $each: [
            {
              title: options.title,
              body: options.body,
              read: false,
              createdAt: new Date().toISOString(),
              link: options.link,
            },
          ],
        },
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      useFindAndModify: false,
    },
  );

  const { _id, body, createdAt, link, read, title } = notification.notifications[0];

  pubsub.publish('NOTIFICATION', {
    notification: {
      _id,
      body,
      createdAt,
      link,
      read,
      title,
      username: 'yuri014',
    },
  });
};

export default createNotification;
