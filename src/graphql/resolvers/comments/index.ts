import { IResolvers } from 'apollo-server-express';

import checkAuth from '../../../middlewares/checkAuth';
import findComments from './services/find';
import { createComment, createLikeComment } from './services/create';
import { deleteCommentService, dislikeCommentService } from './services/delete';
import levelUp from '../../../functions/levelUp';

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

    async deleteComment(_, { id }: { id: string }, context) {
      const user = checkAuth(context);

      return deleteCommentService(id, user);
    },

    async likeComment(_, { id }: { id: string }, context) {
      const user = checkAuth(context);

      return createLikeComment(id, user);
    },

    async dislikeComment(_, { id }: { id: string }, context) {
      const user = checkAuth(context);

      return dislikeCommentService(id, user);
    },
  },
};

export default commentsResolvers;
