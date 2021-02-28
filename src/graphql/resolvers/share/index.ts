import { IResolvers } from 'apollo-server-express';

import { IShareInput } from '../../../interfaces/Share';
import checkAuth from '../../../middlewares/checkAuth';
import share from './services/create';

const shareResolvers: IResolvers = {
  Mutation: {
    async createSharePost(_, { shareInput }: { shareInput: IShareInput }, context) {
      const user = checkAuth(context);

      return share(user, shareInput);
    },
  },
};

export default shareResolvers;
