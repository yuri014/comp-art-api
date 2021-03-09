import { UserInputError } from 'apollo-server-express';
import ArtistProfile from '../../../../entities/ArtistProfile';
import Comments from '../../../../entities/Comments';
import Post from '../../../../entities/Post';
import UserProfile from '../../../../entities/UserProfile';

import { IToken } from '../../../../interfaces/Token';
import commentValidationSchema from '../../../../validators/commentSchema';

export const createComment = async (id: string, comment: string, user: IToken) => {
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

  const post = await Post.findById(id);

  if (!post) {
    throw new UserInputError('Post inválido', {
      errors: 'Não há post',
    });
  }

  await Comments.updateOne(
    {
      post: id,
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

  return updatedProfile;
};

export const createLikeComment = async (id: string, user: IToken) => {
  const query = {
    'comments._id': id,
  };

  const hasLike = await Comments.findOne({
    'comments._id': id,
    'comments.likes.author': user.username,
  }).select({ comments: { $elemMatch: { _id: id, 'likes.author': user.username } } });

  if (hasLike && hasLike.comments.length > 0) {
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
};
