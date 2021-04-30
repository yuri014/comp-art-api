import { IResolvers } from 'apollo-server-express';
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
import Post from '../../../entities/Post';
import getToken from '../../../auth/getToken';
import { ID } from '../../../interfaces/General';

const postResolvers: IResolvers = {
  Query: {
    async getPost(_, { id }: ID, context) {
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

    async searchPost(_, { query, offset }: { query: string; offset: number }) {
      const profiles = await Post.find({ $text: { $search: query } })
        .skip(offset)
        .limit(10)
        .sort({ createdAt: -1 })
        .populate('artist')
        .populate('likes.profile')
        .where('likes')
        .slice([0, 3]);

      return profiles;
    },
  },
  Mutation: {
    async createPost(_, { postInput }: { postInput: IPostInput }, context) {
      const user = checkAuth(context);

      return createNewPost(postInput, user);
    },

    async like(_, { id }: ID, context) {
      const user = checkAuth(context);

      return likePost(id, user);
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
