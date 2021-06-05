import { IResolvers } from 'apollo-server-express';
import SavedPost from '../../../entities/SavedPost';

import checkAuth from '../../../middlewares/checkAuth';
import savedPostCompose from './services/composers/composeSavedPostServices';
import createSavedPost from './services/create';
import deleteSavedPostService from './services/delete';

type PostID = { postID: string };

const savedPostsResolvers: IResolvers = {
  Query: {
    async getSavedPosts(_, { offset }: { offset: number }, context) {
      const user = checkAuth(context);

      const savedPosts = await SavedPost.findOne({ user: user.id })
        .skip(offset)
        .limit(10)
        .populate('posts.post')
        .populate({
          path: 'posts.post',
          populate: {
            path: 'artist',
          },
        })
        .populate({
          path: 'posts.post',
          populate: {
            path: 'profile',
          },
        })
        .populate({
          path: 'posts.post',
          populate: {
            path: 'likes.profile',
          },
        })
        .where('posts.post.likes')
        .slice([0, 1]);

      const posts = savedPosts?.posts.map(({ post }) => post);
      return posts;
    },
  },
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
