import { IResolvers, PubSub } from 'apollo-server-express';
import getToken from '../../../auth/getToken';

import Share from '../../../entities/Share';
import { ID } from '../../../interfaces/General';
import { IShareInput } from '../../../interfaces/Share';
import checkAuth from '../../../middlewares/checkAuth';
import likeHandler from '../../../utils/likeHandle';
import createShare from './services/create';
import deleteShareService from './services/delete';
import findWhoSharesPost from './services/find';

const shareResolvers: IResolvers = {
  Query: {
    async getWhoSharesPost(_, { postID, offset }: { postID: string; offset: number }, context) {
      const token = getToken(context);

      return findWhoSharesPost({ offset, postID, token });
    },
  },
  Mutation: {
    async createSharePost(_, { shareInput }: { shareInput: IShareInput }, context) {
      const user = checkAuth(context);

      const pubsub = context.pubsub as PubSub;

      return createShare(user, shareInput, pubsub);
    },
    async deleteShare(_, { id }: ID, context) {
      const user = checkAuth(context);

      return deleteShareService(id, user);
    },

    async likeShare(_, { id }: ID, context) {
      const user = checkAuth(context);

      await likeHandler(id, user, Share, 'like');

      return true;
    },

    async dislikeShare(_, { id }: ID, context) {
      const user = checkAuth(context);

      await likeHandler(id, user, Share, 'dislike');

      return true;
    },
  },
};

export default shareResolvers;
