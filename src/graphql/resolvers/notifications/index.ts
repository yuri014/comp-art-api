import { IResolvers, PubSub } from 'apollo-server-express';

const NOTIFICATION = 'NOTIFICATION';

const notificationsResolvers: IResolvers = {
  Subscription: {
    notification: {
      subscribe: (_, __, { pubsub }: { pubsub: PubSub }) => pubsub.asyncIterator(NOTIFICATION),
    },
  },
};

export default notificationsResolvers;
