import { AuthenticationError, UserInputError } from 'apollo-server-express';
import ArtistProfile from '../../../../entities/ArtistProfile';

import Post from '../../../../entities/Post';
import UserProfile from '../../../../entities/UserProfile';
import { IToken } from '../../../../interfaces/Token';
import levelDown from '../../../../utils/levelDown';

const options = {
  new: true,
  useFindAndModify: false,
};

export const dislikePost = async (id: string, user: IToken) => {
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

  if (user.isArtist) {
    const updatedProfile = await ArtistProfile.findOne({ owner: user.username }, options);

    if (!updatedProfile) {
      throw Error();
    }

    return levelDown(updatedProfile, 75);
  }

  const updatedProfile = await UserProfile.findOne({ owner: user.username }, options);

  if (!updatedProfile) {
    throw Error();
  }

  return levelDown(updatedProfile, 75);
};

export const deletePostService = async (id: string, user: IToken) => {
  const post = await Post.findById(id);

  if (!post) {
    throw new UserInputError('Não há post');
  }

  if (post.artist.username !== user.username) {
    throw new AuthenticationError('Você não é o autor deste post');
  }

  try {
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
