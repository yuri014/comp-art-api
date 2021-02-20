import { IResolvers } from 'graphql-tools';

import { IPostInput } from '../../../interfaces/Post';
import checkAuth from '../../../middlewares/checkAuth';
import likePost from './services/update';
import createNewPost from './services/create';
import {
  getPostService,
  getProfilePostsService,
  getTimelinePosts,
  getExplorePostsService,
  getPostLikes,
} from './services/find';
import { deletePostService, dislikePost } from './services/delete';

interface Context {
  req: {
    headers: {
      authorization: string;
    };
  };
}

const getToken = (context: Context) => {
  const authHeader = context.req.headers.authorization;

  if (!authHeader) {
    return '';
  }

  const token = authHeader.split('Bearer ')[1];
  return token;
};

const postResolvers: IResolvers = {
  Query: {
    async getPost(_, { id }: { id: string }, context) {
      const token = getToken(context);

      return getPostService(id, token);
    },
    async getPosts(_, { offset }: { offset: number }, context) {
      const user = checkAuth(context);

      return getTimelinePosts(offset, user);
    },
    async getProfilePosts(_, { offset, username }: { offset: number; username: string }, context) {
      const token = getToken(context);

      return getProfilePostsService(token, username, offset);
    },
    async getExplorePosts(_, { offset }: { offset: number }, context) {
      const token = getToken(context);

      return getExplorePostsService(offset, token);
    },
    async getLikes(_, { postID, offset }: { postID: string; offset: number }) {
      return getPostLikes(postID, offset);
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
