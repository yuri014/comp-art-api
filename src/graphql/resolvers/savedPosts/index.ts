import { IResolvers } from 'apollo-server-express';

import checkAuth from '../../../middlewares/checkAuth';
import savedPostCompose from './services/composers/composeSavedPostServices';
import createSavedPost from './services/create';
import deleteSavedPostService from './services/delete';

type PostID = { postID: string };

const savedPostsResolvers: IResolvers = {
  Query: {},
  Mutation: {
    async addSavedPost(_, { postID }: PostID, context) {
      const user = checkAuth(context);

      const isSavedPostCreated = await savedPostCompose(user, postID);

      return isSavedPostCreated(createSavedPost);
    },

    async deleteSavedPost(_, { postID }: PostID, context) {
      const user = checkAuth(context);

      const isSavedPostDeleted = await savedPostCompose(user, postID);

      return isSavedPostDeleted(deleteSavedPostService);
    },
  },
};

export default savedPostsResolvers;
