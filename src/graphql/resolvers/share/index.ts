import { IResolvers } from 'apollo-server-express';

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
    async deleteShare(_, { id }: { id: string }, context) {
      const user = checkAuth(context);

      return deleteShareService(id, user);
    },
  },
};

export default shareResolvers;
