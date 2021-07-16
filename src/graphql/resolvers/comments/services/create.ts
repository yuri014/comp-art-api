import { PubSub, UserInputError } from 'apollo-server-express';

import ArtistProfile from '../../../../entities/ArtistProfile';
import Comments from '../../../../entities/Comments';
import Post from '../../../../entities/Post';
import Share from '../../../../entities/Share';
import UserProfile from '../../../../entities/UserProfile';
import mentionUser from '../../../../functions/mentionUser';
import { IPost } from '../../../../interfaces/Post';
import { IArtistProfile } from '../../../../interfaces/Profile';
import { IToken } from '../../../../interfaces/Token';
import xpValues from '../../../../utils/xpValues';
import commentValidationSchema from '../../../../validators/commentSchema';
import createNotification from '../../notifications/services/create';
import findProfile from '../../profiles/services/utils/findProfileUtil';

export const createComment = async (id: string, comment: string, user: IToken, pubsub: PubSub) => {
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

  const newComment = await Comments.findOneAndUpdate(
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
      new: true,
    },
  ).populate({
    path: 'post',
    populate: {
      path: 'artist',
    },
  });

  if (!newComment) {
    throw new UserInputError('Não há post');
  }

  const commentedPost = newComment.post as IPost;
  const artistPostOwner = commentedPost.artist as IArtistProfile;

  await createNotification(
    {
      body: 'comentou em sua publicação',
      link: `/post/${id}`,
      from: user.username,
      username: artistPostOwner.owner,
      avatar: profile._doc?.avatar as string,
    },
    pubsub,
  );

  await mentionUser({
    avatar: profile._doc?.avatar as string,
    description: comment,
    from: user.username,
    link: `/post/${id}`,
    pubsub,
  });

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

    if (!updatedProfile) {
      throw new Error();
    }

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
    { $push: { 'comments.$.likes': update }, $inc: { 'comments.$.likesCount': 1 } },
    { useFindAndModify: false, new: true, upsert: true },
  );

  if (!comment) {
    throw new UserInputError('Não há comentário');
  }

  return true;
};
