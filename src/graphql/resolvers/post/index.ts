import { IResolvers } from 'graphql-tools';

import Post from '../../../entities/Post';
import ArtistProfile from '../../../entities/ArtistProfile';
import { IPostInput } from '../../../interfaces/Post';
import checkAuth from '../../../middlewares/checkAuth';
import likePost from './services/update';
import createNewPost from './services/create';
import { getTimelinePosts } from './services/find';
import dislikePost from './services/delete';

const postResolvers: IResolvers = {
  Query: {
    async getPosts(parent, { offset }: { offset: number }, context) {
      const user = checkAuth(context);

      return getTimelinePosts(offset, user);
    },
    async getProfilePosts(_, { offset, username }: { offset: number; username: string }) {
      const profile = await ArtistProfile.findOne({ owner: username });

      if (profile) {
        const posts = await Post.find({
          artist: {
            name: profile.name,
            username,
          },
        })
          .skip(offset)
          .limit(3)
          .sort({ createdAt: -1 });

        return posts;
      }
      return [];
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
  },
};

export default postResolvers;
