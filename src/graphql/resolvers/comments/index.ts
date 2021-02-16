import { UserInputError } from 'apollo-server-express';
import { IResolvers } from 'graphql-tools';

import Post from '../../../entities/Post';
import Comments from '../../../entities/Comments';
import checkAuth from '../../../middlewares/checkAuth';
import commentValidationSchema from '../../../validators/commentSchema';

interface CommentInput {
  body: string;
  author: string;
}

const commentsResolvers: IResolvers = {
  Mutation: {
    async comment(_, { postID, comment }: { postID: string; comment: CommentInput }, context) {
      const user = checkAuth(context);

      const errors = commentValidationSchema.validate({
        body: comment.body,
        author: comment.author,
      });

      if (errors.error) {
        throw new UserInputError('Erros', {
          errors: errors.error.message,
        });
      }

      const { author, body } = comment;

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
              author,
              body: body.trim(),
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

      return true;
    },
  },
};

export default commentsResolvers;
