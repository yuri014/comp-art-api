import { UserInputError } from 'apollo-server-express';

import Post from '../../../../entities/Post';
import { IToken } from '../../../../interfaces/Token';

const dislikePost = async (id: string, user: IToken) => {
  const post = await Post.findById(id);

  if (!post) {
    throw new UserInputError('Não há post');
  }

  const hasAlreadyLike = post.likes.find(profileLike => profileLike.username === user.username);

  if (!hasAlreadyLike) {
    throw new UserInputError('Não curtiu esse post');
  }

  try {
    await post.updateOne(
      {
        $pull: {
          likes: {
            avatar: hasAlreadyLike.avatar,
            createdAt: hasAlreadyLike.createdAt,
            username: hasAlreadyLike.username,
          },
        },
        $inc: {
          likesCount: -1,
        },
      },
      { useFindAndModify: false },
    );
  } catch (error) {
    throw new Error(error);
  }

  return true;
};

export default dislikePost;
