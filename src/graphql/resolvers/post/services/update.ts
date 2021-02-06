import { UserInputError } from 'apollo-server-express';
import Post from '../../../../entities/Post';
import { IToken } from '../../../../interfaces/Token';
import findProfile from '../../profiles/services/find';

const favoritePost = async (id: string, user: IToken) => {
  const profile = await findProfile(user);

  const profileDoc = profile._doc;

  if (!profileDoc) {
    throw new UserInputError('Não há perfil');
  }

  const post = await Post.findById(id);

  if (!post) {
    throw new UserInputError('Não há post');
  }

  const hasAlreadyLike = post.likes.find(profileLike => profileLike.username === profileDoc.owner);

  if (hasAlreadyLike) {
    throw new UserInputError('Já curtiu esse post');
  }

  try {
    post.updateOne(
      {
        $push: {
          likes: {
            avatar: profileDoc.avatar,
            createdAt: new Date().toISOString(),
            username: profileDoc.owner,
          },
        },
        $inc: {
          likesCount: 1,
        },
      },
      { useFindAndModify: false },
    );
  } catch (error) {
    throw new Error(error);
  }

  return false;
};

export default favoritePost;
