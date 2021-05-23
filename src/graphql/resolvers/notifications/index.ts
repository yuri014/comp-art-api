import { IResolvers, withFilter } from 'apollo-server-express';
import checkAuth from '../../../middlewares/checkAuth';

const notificationsResolvers: IResolvers = {
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
