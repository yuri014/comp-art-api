import { IResolvers } from 'graphql-tools';

import { IPostInput } from '../../../interfaces/Post';
import checkAuth from '../../../middlewares/checkAuth';
import likePost from './services/update';
import createNewPost from './services/create';
import { getPostService, getProfilePostsService, getTimelinePosts } from './services/find';
import { deletePostService, dislikePost } from './services/delete';

const postResolvers: IResolvers = {
  Query: {
    async getPost(_, { id }: { id: string }) {
      return getPostService(id);
    },
    async getPosts(_, { offset }: { offset: number }, context) {
      const user = checkAuth(context);

      return getTimelinePosts(offset, user);
    },
    async getProfilePosts(_, { offset, username }: { offset: number; username: string }, context) {
      const authHeader = context.req.headers.authorization;
      const token = authHeader.split('Bearer ')[1];

      return getProfilePostsService(token, username, offset);
    },
  },
  Mutation: {
    async createPost(_, { postInput }: { postInput: IPostInput }, context) {
      const user = checkAuth(context);

      return createNewPost(postInput, user);
    },

    async like(_, { id }: { id: string }, context) {
      const user = checkAuth(context);

      return likePost(id, user);
    },

    async dislike(_, { id }: { id: string }, context) {
      const user = checkAuth(context);

      return dislikePost(id, user);
    },

    async deletePost(_, { id }: { id: string }, context) {
      const user = checkAuth(context);

      return deletePostService(id, user);
    },
  },
};

export default postResolvers;
