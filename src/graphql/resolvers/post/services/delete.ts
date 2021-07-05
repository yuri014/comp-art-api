import { AuthenticationError, UserInputError } from 'apollo-server-express';

import ArtistProfile from '../../../../entities/ArtistProfile';
import Comments from '../../../../entities/Comments';
import Post from '../../../../entities/Post';
import Share from '../../../../entities/Share';
import UserProfile from '../../../../entities/UserProfile';
import levelDown from '../../../../functions/levelDown';
import { IArtistProfile } from '../../../../interfaces/Profile';
import { IToken } from '../../../../interfaces/Token';
import genericUpdateOptions from '../../../../utils/genericUpdateOptions';
import likeHandler from '../../../../utils/likeHandle';
import removeFile from '../../../../utils/removeFile';
import xpValues from '../../../../utils/xpValues';

export const dislikePost = async (id: string, user: IToken) => {
  likeHandler(id, user, Post, 'dislike');

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
      removeFile(post.body);
    }

    if (post.thumbnail) {
      removeFile(post.thumbnail);
    }

    post.deleteOne();
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
    genericUpdateOptions,
  );

  if (!updatedProfile) {
    throw Error();
  }

  Share.deleteMany({ post: id });
  Comments.deleteMany({ post: id });

  const { postXP } = xpValues;

  return levelDown(updatedProfile, postXP);
};
