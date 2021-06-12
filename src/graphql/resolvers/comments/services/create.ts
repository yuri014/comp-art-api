import { UserInputError } from 'apollo-server-express';

import ArtistProfile from '../../../../entities/ArtistProfile';
import Comments from '../../../../entities/Comments';
import Post from '../../../../entities/Post';
import Share from '../../../../entities/Share';
import UserProfile from '../../../../entities/UserProfile';
import { IToken } from '../../../../interfaces/Token';
import xpValues from '../../../../utils/xpValues';
import commentValidationSchema from '../../../../validators/commentSchema';
import findProfile from '../../profiles/services/utils/findProfileUtil';

export const createComment = async (id: string, comment: string, user: IToken) => {
  const post = await Post.findById(id);
  const share = await Share.findById(id);

  if (!post && !share) {
    throw new UserInputError('Não há post');
  }

  const errors = commentValidationSchema.validate({
    comment,
  });

  if (errors.error) {
    throw new UserInputError(errors.error.message);
  }

  const profile = user.isArtist
    ? await ArtistProfile.findOne({ owner: user.username })
    : await UserProfile.findOne({ owner: user.username });

  if (!profile) {
    throw new UserInputError('Não há perfil');
  }

  const profileDoc = profile._doc;

  await Comments.updateOne(
    {
      post: id,
      onModel: post?._doc?._id ? 'Post' : 'Share',
    },
    {
      $push: {
        comments: {
          $position: 0,
          $each: [
            {
              author: profileDoc?._id,
              body: comment.trim(),
              onModel: user.isArtist ? 'ArtistProfile' : 'UserProfile',
              createdAt: new Date().toISOString(),
            },
          ],
        },
      },
    },
    {
      useFindAndModify: false,
      upsert: true,
    },
  );

  await post?.updateOne({ $inc: { commentsCount: 1 } });

  if (post?._doc?._id) {
    const { commentXP } = xpValues;

    const updateProfile = () => {
      if (user.isArtist) {
        return ArtistProfile.findByIdAndUpdate(
          profile._doc?._id,
          {
            $inc: {
              xp: commentXP,
            },
          },
          { useFindAndModify: false, new: true },
        );
      }

      return UserProfile.findByIdAndUpdate(
        profile._doc?._id,
        {
          $inc: {
            xp: commentXP,
          },
        },
        { useFindAndModify: false, new: true },
      );
    };

    const updatedProfile = await updateProfile();

    return updatedProfile;
  }

  return false;
};

export const createLikeComment = async (id: string, user: IToken) => {
  const query = {
    comments: { $elemMatch: { _id: id } },
  };

  const profile = await findProfile(user);

  const hasLike = await Comments.findOne({
    comments: {
      $elemMatch: { _id: id, likes: { $elemMatch: { author: profile._doc?._id } } },
    },
  }).lean();

  if (hasLike && hasLike.comments.length > 0) {
    throw new UserInputError('Já curtiu esse comentário');
  }

  const update = {
    author: profile._doc?._id,
    onModel: user.isArtist ? 'ArtistProfile' : 'UserProfile',
  };

  const comment = await Comments.findOneAndUpdate(
    query,
    { $push: { 'comments.$.likes': update } },
    { useFindAndModify: false, new: true },
  );

  if (!comment) {
    throw new UserInputError('Não há comentário');
  }

  return true;
};
