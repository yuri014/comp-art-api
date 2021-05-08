import { IResolvers } from 'apollo-server-express';

import checkAuth from '../../../middlewares/checkAuth';
import createSavedPost from './services/create';

const savedPostsResolvers: IResolvers = {
  Query: {},
  Mutation: {
    async addSavedPost(_, { postID }: { postID: string }, context) {
      const user = checkAuth(context);

      return createSavedPost(user, postID);
    },
  },
};

export default savedPostsResolvers;
