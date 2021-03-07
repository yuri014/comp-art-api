import { IResolvers, UserInputError } from 'apollo-server-express';

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
      const comments = await Comments.findOne({ post: postID })
        .where('comments')
        .slice([offset, offset + 3])
        .populate('comments.author');

      if (!comments) {
        throw new Error();
      }

      if (comments.comments) {
        return comments?.comments;
      }

      return [];
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
              $position: 0,
              $each: [
                {
                  author: profile._id,
                  body: comment.trim(),
                  onModel: user.isArtist ? 'ArtistProfile' : 'UserProfile',
                  createdAt: new Date().toISOString(),
                },
              ],
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
            xp: 150,
          },
        },
        { useFindAndModify: false, new: true },
      );

      return levelUp(updatedProfile);
    },

    async likeComment(_, { id }: { id: string }, context) {
      const user = checkAuth(context);

      const query = {
        'comments._id': id,
      };

      const hasLike = await Comments.findOne({
        'comments.likes.author': user.username,
      });

      if (hasLike) {
        throw new UserInputError('Já curtiu esse comentário');
      }

      const update = {
        author: user.username,
        onModel: user.isArtist ? 'ArtistProfile' : 'UserProfile',
      };

      const comment = await Comments.updateOne(
        query,
        { $push: { 'comments.$.likes': update } },
        { useFindAndModify: false },
      );

      if (!comment) {
        throw new UserInputError('Não há comentário');
      }

      return true;
    },
  },
};

export default commentsResolvers;
