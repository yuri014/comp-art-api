import { IResolvers, UserInputError, withFilter } from 'apollo-server-express';
import Notification from '../../../entities/Notification';

import checkAuth from '../../../middlewares/checkAuth';
import findNotifications from './services/find';

const notificationsResolvers: IResolvers = {
  Query: {
    async getNotifications(_, { offset }: { offset: number }, context) {
      const user = checkAuth(context);

      return findNotifications(user, offset);
    },
  },
  Mutation: {
    async readNotifications(_, { notificationID }: { notificationID: string }, context) {
      checkAuth(context);

      try {
        await Notification.findOneAndUpdate(
          {
            'notifications._id': notificationID,
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
