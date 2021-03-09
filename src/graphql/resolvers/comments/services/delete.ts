import { UserInputError } from 'apollo-server-express';

import Comments from '../../../../entities/Comments';
import { IToken } from '../../../../interfaces/Token';

const dislikeCommentService = async (likeID: string, user: IToken) => {
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

export default dislikeCommentService;
