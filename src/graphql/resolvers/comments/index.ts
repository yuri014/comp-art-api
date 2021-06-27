import { IResolvers } from 'apollo-server-express';

import checkAuth from '../../../middlewares/checkAuth';
import levelUp from '../../../functions/levelUp';
import { ID } from '../../../interfaces/General';
import findComments from './services/find';
import { createComment } from './services/create';
import { deleteCommentService } from './services/delete';

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

      if (typeof updatedProfile !== 'boolean') {
        return levelUp(updatedProfile);
      }

      return false;
    },

    async deleteComment(_, { id }: ID, context) {
      const user = checkAuth(context);

      return deleteCommentService(id, user);
    },
  },
};

export default commentsResolvers;
