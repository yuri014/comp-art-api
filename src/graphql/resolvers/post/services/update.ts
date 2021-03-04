import { UserInputError } from 'apollo-server-express';
import ArtistProfile from '../../../../entities/ArtistProfile';

import Post from '../../../../entities/Post';
import UserProfile from '../../../../entities/UserProfile';
import { IToken } from '../../../../interfaces/Token';
import levelUp from '../../../../utils/levelUp';
import findProfile from '../../profiles/services/utils/findProfileUtil';

const options = {
  new: true,
  useFindAndModify: false,
};

const likePost = async (id: string, user: IToken) => {
  const getProfile = await findProfile(user);

  const profileDoc = getProfile._doc;

  if (!profileDoc) {
    throw new UserInputError('Não há perfil');
  }

  const post = await Post.findById(id).populate('likes.profile');

  if (!post) {
    throw new UserInputError('Não há post');
  }

  // @ts-ignore
  const hasAlreadyLike = post.likes.find(({ profile }) => profile.owner === profileDoc.owner);

  if (hasAlreadyLike) {
    throw new UserInputError('Já curtiu esse post');
  }

  try {
    await post.updateOne(
      {
        $push: {
          likes: {
            $position: 0,
            $each: [
              {
                profile: profileDoc._id as string,
                onModel: user.isArtist ? 'ArtistProfile' : 'UserProfile',
              },
            ],
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
