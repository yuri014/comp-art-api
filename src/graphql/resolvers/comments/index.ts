import { UserInputError } from 'apollo-server-express';
import { IResolvers } from 'graphql-tools';

import Post from '../../../entities/Post';
import Comments from '../../../entities/Comments';
import checkAuth from '../../../middlewares/checkAuth';
import commentValidationSchema from '../../../validators/commentSchema';
import levelUp from '../../../utils/levelUp';
import ArtistProfile from '../../../entities/ArtistProfile';
import UserProfile from '../../../entities/UserProfile';

const commentsResolvers: IResolvers = {
  Query: {
    async getComments(_, { postID, offset }: { postID: string; offset: number }) {
      const comments = await Comments.find({ post: postID })
        .skip(offset)
        .limit(10)
        .sort({ createdAt: -1 })
        .populate('author');

      return comments;
    },
  },
  Mutation: {
    async comment(_, { postID, comment }: { postID: string; comment: string }, context) {
      const user = checkAuth(context);

      const errors = commentValidationSchema.validate({
        comment,
      });

      if (errors.error) {
        throw new UserInputError('Erros', {
          errors: errors.error.message,
        });
      }

      const profile = user.isArtist
        ? await ArtistProfile.findOne({ owner: user.username })
        : await UserProfile.findOne({ owner: user.username });

      if (!profile) {
        throw new UserInputError('Não há perfil');
      }

      const post = await Post.findById(postID);

      if (!post) {
        throw new UserInputError('Post inválido', {
          errors: 'Não há post',
        });
      }

      await Comments.updateOne(
        {
          post: postID,
        },
        {
          $push: {
            comments: {
              author: profile._id,
              body: comment.trim(),
              onModel: user.isArtist ? 'ArtistProfile' : 'UserProfile',
              createdAt: new Date().toISOString(),
            },
          },
        },
        {
          useFindAndModify: false,
          upsert: true,
        },
      );

      const updatedProfile = await profile.updateOne(
        {
          $inc: {
            xp: 125,
          },
        },
        { useFindAndModify: false, new: true },
      );

      return levelUp(updatedProfile);
    },
  },
};

export default commentsResolvers;
