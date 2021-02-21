import { AuthenticationError, UserInputError } from 'apollo-server-express';
import ArtistProfile from '../../../../entities/ArtistProfile';

import Post from '../../../../entities/Post';
import UserProfile from '../../../../entities/UserProfile';
import { IArtistProfile } from '../../../../interfaces/Profile';
import { IToken } from '../../../../interfaces/Token';
import levelDown from '../../../../utils/levelDown';
import removeFile from '../../../../utils/removeFile';

const options = {
  new: true,
  useFindAndModify: false,
};

export const dislikePost = async (id: string, user: IToken) => {
  const post = await Post.findById(id).populate('likes.profile');

  if (!post) {
    throw new UserInputError('Não há post');
  }

  // @ts-ignore
  const hasAlreadyLike = post.likes.find(({ profile }) => profile.owner === user.username);

  if (!hasAlreadyLike) {
    throw new UserInputError('Não curtiu esse post');
  }

  try {
    await post.updateOne(
      {
        $pull: {
          likes: {
            profile: hasAlreadyLike.profile,
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

  if (user.isArtist) {
    const updatedProfile = await ArtistProfile.findOne({ owner: user.username });

    if (!updatedProfile) {
      throw Error();
    }

    return levelDown(updatedProfile, 75);
  }

  const updatedProfile = await UserProfile.findOne({ owner: user.username });

  if (!updatedProfile) {
    throw Error();
  }

  return levelDown(updatedProfile, 75);
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
    await removeFile(post.body);
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

  return levelDown(updatedProfile, 250);
};
