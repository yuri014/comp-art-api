import { UserInputError } from 'apollo-server-express';

import Comments from '../../../../entities/Comments';
import ArtistProfile from '../../../../entities/ArtistProfile';
import UserProfile from '../../../../entities/UserProfile';
import { IToken } from '../../../../interfaces/Token';
import xpValues from '../../../../utils/xpValues';
import levelDown from '../../../../functions/levelDown';
import findProfile from '../../profiles/services/utils/findProfileUtil';

export const dislikeCommentService = async (idComment: string, user: IToken) => {
  const profile = await findProfile(user);

  const query = {
    comments: {
      $elemMatch: { _id: idComment, likes: { $elemMatch: { author: profile._doc?._id } } },
    },
  };

  const hasLike = await Comments.findOne(query).lean();

  if (!hasLike) {
    throw new UserInputError('Não curtiu esse comentário');
  }

  try {
    await Comments.updateOne(
      query,
      {
        $pull: {
          // @ts-ignore
          'comments.$.likes': {
            author: profile._doc?._id,
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
    'comments.author': profile._doc?._id,
  });

  if (!comment) {
    throw new UserInputError('Não há comentário');
  }

  await comment.updateOne(
    {
      $pull: {
        comments: {
          _id: commentId,
          author: profile._doc?._id,
        },
      },
    },
    { useFindAndModify: false },
  );

  if (comment.onModel === 'Post') {
    const { commentXP } = xpValues;

    return levelDown(profile, commentXP);
  }

  return false;
};
