import { IResolvers } from 'apollo-server-express';

import Share from '../../../entities/Share';
import likeContent from '../../../functions/likeContent';
import { ID } from '../../../interfaces/General';
import { IShareInput } from '../../../interfaces/Share';
import checkAuth from '../../../middlewares/checkAuth';
import createShare from './services/create';
import deleteShareService from './services/delete';

const shareResolvers: IResolvers = {
  Mutation: {
    async createSharePost(_, { shareInput }: { shareInput: IShareInput }, context) {
      const user = checkAuth(context);

      return createShare(user, shareInput);
    },
    async deleteShare(_, { id }: ID, context) {
      const user = checkAuth(context);

      return deleteShareService(id, user);
    },

    async likeShare(_, { id }: ID, context) {
      const user = checkAuth(context);

      await likeContent(id, user, Share);

      return true;
    },

    async dislikeShare(_, { id }: ID, context) {
      const user = checkAuth(context);
    },
  },
};

export default shareResolvers;
