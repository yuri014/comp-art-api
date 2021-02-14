import { UserInputError } from 'apollo-server-express';
import ArtistProfile from '../../../../entities/ArtistProfile';

import Post from '../../../../entities/Post';
import UserProfile from '../../../../entities/UserProfile';
import { IToken } from '../../../../interfaces/Token';
import levelUp from '../../../../utils/levelUp';
import findProfile from '../../profiles/services/find';

const options = {
  new: true,
  useFindAndModify: false,
};

const likePost = async (id: string, user: IToken) => {
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
    await post.updateOne(
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

  if (user.isArtist) {
    const updatedProfile = await ArtistProfile.findOneAndUpdate(
      { owner: user.username },
      {
        $inc: {
          xp: 75,
        },
      },
      options,
    );

    if (!updatedProfile) {
      throw Error();
    }

    return levelUp(updatedProfile);
  }

  const updatedProfile = await UserProfile.findOneAndUpdate(
    { owner: user.username },
    {
      $inc: {
        xp: 75,
      },
    },
    options,
  );

  if (!updatedProfile) {
    throw Error();
  }

  return levelUp(updatedProfile);
};

export default likePost;
