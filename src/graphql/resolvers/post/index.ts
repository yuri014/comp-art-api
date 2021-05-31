import { IResolvers, PubSub } from 'apollo-server-express';
import { IPostInput } from '../../../interfaces/Post';
import checkAuth from '../../../middlewares/checkAuth';
import getToken from '../../../auth/getToken';
import { ID } from '../../../interfaces/General';
import likePost from './services/update';
import createNewPost from './services/create';
import FindPost from './services/find';
import { deletePostService, dislikePost } from './services/delete';

const postResolvers: IResolvers = {
  Query: {
    async getPost(_, { id }: ID, context) {
      const token = getToken(context);

      return FindPost.getPostService(id, token);
    },
    async getPosts(_, { offset }: { offset: number }, context) {
      const user = checkAuth(context);

      return FindPost.getTimelinePosts(offset, user);
    },
    async getProfilePosts(_, { offset, username }: { offset: number; username: string }, context) {
      const token = getToken(context);

      return FindPost.getProfilePostsService(token, username, offset);
    },
    async getExplorePosts(_, { offset }: { offset: number }, context) {
      const token = getToken(context);

      return FindPost.getExplorePostsService(offset, token);
    },
    async getLikes(_, { postID, offset }: { postID: string; offset: number }) {
      return FindPost.getPostLikes(postID, offset);
    },

    async searchPost(_, { query, offset }: { query: string; offset: number }, context) {
      const token = getToken(context);

      return FindPost.searchPostService(offset, query, token);
    },
  },
  Mutation: {
    async createPost(_, { postInput }: { postInput: IPostInput }, context) {
      const user = checkAuth(context);

      return createNewPost(postInput, user);
    },

    async like(_, { id }: ID, context) {
      const user = checkAuth(context);
      const pubsub = context.pubsub as PubSub;

      return likePost(id, user, pubsub);
    },

    async dislike(_, { id }: ID, context) {
      const user = checkAuth(context);

      return dislikePost(id, user);
    },

    async deletePost(_, { id }: ID, context) {
      const user = checkAuth(context);

      return deletePostService(id, user);
    },
  },
};

export default postResolvers;
