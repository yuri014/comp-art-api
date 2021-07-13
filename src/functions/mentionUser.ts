import { PubSub } from 'apollo-server-express';

import createNotification from '../graphql/resolvers/notifications/services/create';
import getMentions from '../utils/getMentions';

type IMentionUser = {
  description: string | undefined;
  link: string;
  from: string;
  avatar: string;
  pubsub: PubSub;
};

const mentionUser = async (options: IMentionUser) => {
  const { avatar, description, from, link, pubsub } = options;

  if (description) {
    const mentions = getMentions(description);

    if (mentions) {
      await Promise.all(
        mentions.map(async mention => {
          await createNotification(
            {
              body: 'mencionou você!',
              link,
              from,
              username: mention.replace('@', ''),
              avatar,
            },
            pubsub,
          );
        }),
      );
    }
  }
};

export default mentionUser;
