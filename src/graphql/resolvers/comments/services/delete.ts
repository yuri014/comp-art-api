import { UserInputError } from 'apollo-server-express';

import Comments from '../../../../entities/Comments';
import ArtistProfile from '../../../../entities/ArtistProfile';
import UserProfile from '../../../../entities/UserProfile';
import { IToken } from '../../../../interfaces/Token';
import levelDown from '../../../../utils/levelDown';
import xpValues from '../../../../utils/xpValues';

export const dislikeCommentService = async (likeID: string, user: IToken) => {
  const hasLike = await Comments.findOne({
    'comments.likes._id': likeID,
    'comments.likes.author': user.username,
  });

  if (!hasLike) {
    throw new UserInputError('Não curtiu esse post');
  }

  try {
    await Comments.updateOne(
      {
        'comments.likes._id': likeID,
        'comments.likes.author': user.username,
      },
      {
        $pull: {
          // @ts-ignore
          'comments.$.likes': {
            _id: likeID,
            author: user.username,
          },
        },
      },
      { useFindAndModify: false },
    );

    return true;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteCommentService = async (commentId: string, user: IToken) => {
  const profile = user.isArtist
    ? await ArtistProfile.findOne({ owner: user.username })
    : await UserProfile.findOne({ owner: user.username });

  if (!profile) {
    throw new UserInputError('Não há perfil');
  }

  const comment = await Comments.findOne({
    'comments._id': commentId,
    'comments.author': profile._id,
  });

  if (!comment) {
    throw new UserInputError('Não há comentário');
  }

  const { commentXP } = xpValues;

  await comment.updateOne(
    {
      $pull: {
        comments: {
          _id: commentId,
          author: profile._id,
        },
      },
    },
    { useFindAndModify: false },
  );

  return levelDown(profile, commentXP);
};
