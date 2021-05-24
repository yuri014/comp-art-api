import { IResolvers, withFilter } from 'apollo-server-express';
import Notification from '../../../entities/Notification';
import checkAuth from '../../../middlewares/checkAuth';

const notificationsResolvers: IResolvers = {
  Query: {
    async getNotifications(_, { offset }: { offset: number }, context) {
      const user = checkAuth(context);
      const notifications = await Notification.findOne({ user: user.id })
        .where('notifications')
        .slice([offset > 0 ? Math.round(offset / 2) : offset, offset + 4]);

      if (!notifications) {
        return [];
      }

      return notifications?.notifications;
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
