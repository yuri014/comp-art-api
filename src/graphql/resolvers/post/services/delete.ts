import { AuthenticationError, UserInputError } from 'apollo-server-express';
import ArtistProfile from '../../../../entities/ArtistProfile';

import Post from '../../../../entities/Post';
import UserProfile from '../../../../entities/UserProfile';
import { IArtistProfile } from '../../../../interfaces/Profile';
import { IToken } from '../../../../interfaces/Token';
import levelDown from '../../../../utils/levelDown';
import removeFile from '../../../../utils/removeFile';
import xpValues from '../../../../utils/xpValues';
import findProfile from '../../profiles/services/utils/findProfileUtil';

const options = {
  new: true,
  useFindAndModify: false,
};

export const dislikePost = async (id: string, user: IToken) => {
  const getProfile = await findProfile(user);

  const profileDoc = getProfile._doc;

  if (!profileDoc) {
    throw new UserInputError('Não há perfil');
  }

  const post = await Post.findById(id)
    .populate('likes.profile')
    .select({ likes: { $elemMatch: { profile: profileDoc._id } } });

  if (!post) {
    throw new UserInputError('Não há post');
  }

  if (post.likes.length === 0) {
    throw new UserInputError('Não curtiu esse post');
  }

  try {
    await post.updateOne(
      {
        $pull: {
          likes: {
            profile: post.likes[0].profile,
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

  const { likeXP } = xpValues;

  if (user.isArtist) {
    const updatedProfile = await ArtistProfile.findOne({ owner: user.username });

    if (!updatedProfile) {
      throw Error();
    }

    return levelDown(updatedProfile, likeXP);
  }

  const updatedProfile = await UserProfile.findOne({ owner: user.username });

  if (!updatedProfile) {
    throw Error();
  }

  return levelDown(updatedProfile, likeXP);
};

export const deletePostService = async (id: string, user: IToken) => {
  const post = await Post.findById(id).populate('artist', 'owner');

  if (!post) {
    throw new UserInputError('Não há post');
  }

  const artist = post.artist as IArtistProfile;

  if (artist.owner !== user.username) {
    throw new AuthenticationError('Você não é o autor deste post');
  }

  try {
    if (post.body) {
      await removeFile(post.body);
    }
    await post.deleteOne();
  } catch (error) {
    throw new Error(error);
  }

  const updatedProfile = await ArtistProfile.findOneAndUpdate(
    { owner: user.username },
    {
      $inc: {
        postCount: -1,
      },
    },
    options,
  );

  if (!updatedProfile) {
    throw Error();
  }

  const { postXP } = xpValues;

  return levelDown(updatedProfile, postXP);
};
