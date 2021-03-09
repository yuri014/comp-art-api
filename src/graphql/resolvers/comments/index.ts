import { IResolvers } from 'apollo-server-express';

import checkAuth from '../../../middlewares/checkAuth';
import levelUp from '../../../utils/levelUp';
import findComments from './services/find';
import { createComment, createLikeComment } from './services/create';

const commentsResolvers: IResolvers = {
  Query: {
    async getComments(_, { postID, offset }: { postID: string; offset: number }) {
      return findComments(postID, offset);
    },
  },
  Mutation: {
    async comment(_, { postID, comment }: { postID: string; comment: string }, context) {
      const user = checkAuth(context);

      const updatedProfile = await createComment(postID, comment, user);

      return levelUp(updatedProfile);
    },

    async likeComment(_, { id }: { id: string }, context) {
      const user = checkAuth(context);

      return createLikeComment(id, user);
    },
  },
};

export default commentsResolvers;
