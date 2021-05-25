import { IResolvers, withFilter } from 'apollo-server-express';

import checkAuth from '../../../middlewares/checkAuth';
import findNotifications from './services/find';
import updateReadNotification from './services/update';

const notificationsResolvers: IResolvers = {
  Query: {
    async getNotifications(_, { offset }: { offset: number }, context) {
      const user = checkAuth(context);

      return findNotifications(user, offset);
    },
  },
  Mutation: {
    async readNotifications(_, { notificationID }: { notificationID: string }, context) {
      const user = checkAuth(context);

      return updateReadNotification(user, notificationID);
    },
  },
  Subscription: {
    notification: {
      subscribe: withFilter(
        (_, __, context) => context.pubsub.asyncIterator('NOTIFICATION'),
        (payload, _, context) => {
          const user = checkAuth(context.connection.context);
          return payload.notification.username === user.username;
        },
      ),
    },
  },
};

export default notificationsResolvers;
