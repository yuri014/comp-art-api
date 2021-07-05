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

const mentionUser = (options: IMentionUser) => {
  const { avatar, description, from, link, pubsub } = options;

  if (description) {
    const mentions = getMentions(description);

    if (mentions) {
      mentions.forEach(mention =>
        createNotification(
          {
            body: 'mencionou você!',
            link,
            from,
            username: mention,
            avatar,
          },
          pubsub,
        ),
      );
    }
  }
};

export default mentionUser;
