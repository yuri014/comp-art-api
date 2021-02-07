import { IResolvers } from 'graphql-tools';
import jwt from 'jsonwebtoken';

import Post from '../../../entities/Post';
import ArtistProfile from '../../../entities/ArtistProfile';
import { IPostInput } from '../../../interfaces/Post';
import checkAuth from '../../../middlewares/checkAuth';
import likePost from './services/update';
import createNewPost from './services/create';
import { getTimelinePosts } from './services/find';
import dislikePost from './services/delete';
import { IToken } from '../../../interfaces/Token';

const postResolvers: IResolvers = {
  Query: {
    async getPosts(parent, { offset }: { offset: number }, context) {
      const user = checkAuth(context);

      return getTimelinePosts(offset, user);
    },
    async getProfilePosts(_, { offset, username }: { offset: number; username: string }, context) {
      const authHeader = context.req.headers.authorization;
      const token = authHeader.split('Bearer ')[1];
      const getUser = () => {
        if (token) {
          return jwt.verify(token, process.env.SECRET as string) as IToken;
        }
        return {
          username: '',
        };
      };
      const user = getUser();
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

        const likes = posts.map(post => post.likes.find(like => like.username === user.username));

        if (likes.length > 0) {
          const postsView = posts.map((post, index) => ({ ...post._doc, isLiked: !!likes[index] }));
          return postsView;
        }

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
