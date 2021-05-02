import { UserInputError } from 'apollo-server-express';
import ArtistProfile from '../../../../entities/ArtistProfile';
import Comments from '../../../../entities/Comments';
import Post from '../../../../entities/Post';
import Share from '../../../../entities/Share';
import UserProfile from '../../../../entities/UserProfile';

import { IToken } from '../../../../interfaces/Token';
import xpValues from '../../../../utils/xpValues';
import commentValidationSchema from '../../../../validators/commentSchema';

export const createComment = async (id: string, comment: string, user: IToken) => {
  const post = await Post.findById(id);
  const share = await Share.findById(id);

  if (!post && !share) {
    throw new UserInputError('Não há post');
  }

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

  await Comments.updateOne(
    {
      post: id,
      onModel: post?._id ? 'Post' : 'Share',
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

  if (post?._id) {
    const { commentXP } = xpValues;

    const updatedProfile = await profile.updateOne(
      {
        $inc: {
          xp: commentXP,
        },
      },
      { useFindAndModify: false, new: true },
    );

    return updatedProfile;
  }

  return false;
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
