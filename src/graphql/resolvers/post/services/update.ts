import { PubSub } from 'apollo-server-express';
import { Model } from 'mongoose';

import ArtistProfile from '../../../../entities/ArtistProfile';
import Post from '../../../../entities/Post';
import UserProfile from '../../../../entities/UserProfile';
import levelUp from '../../../../functions/levelUp';
import { IPost } from '../../../../interfaces/Post';
import { IArtistProfile, IUserProfile } from '../../../../interfaces/Profile';
import { IToken } from '../../../../interfaces/Token';
import genericUpdateOptions from '../../../../utils/genericUpdateOptions';
import likeHandler from '../../../../utils/likeHandle';
import xpValues from '../../../../utils/xpValues';
import createNotification from '../../notifications/services/update';

const likePost = async (id: string, user: IToken, pubsub: PubSub) => {
  await likeHandler(id, user, Post, 'like');

  const artist = (await Post.findById(id).populate('artist', 'owner')) as IPost;

  const { owner } = artist?.artist as IArtistProfile;

  const { likeXP } = xpValues;

  const uploadProfile = async (Profile: Model<IArtistProfile> | Model<IUserProfile>) => {
    // @ts-ignore
    const updatedProfile = await Profile.findOneAndUpdate(
      { owner: user.username },
      {
        $inc: {
          xp: likeXP,
        },
      },
      genericUpdateOptions,
    );

    if (!updatedProfile) {
      throw Error();
    }

    return updatedProfile;
  };

  const updatedProfile = await uploadProfile(user.isArtist ? ArtistProfile : UserProfile);

  await createNotification(
    {
      body: 'curtiu sua publicação',
      link: `/post/${id}`,
      from: user.username,
      username: owner,
      avatar: updatedProfile.avatar,
    },
    pubsub,
  );

  return levelUp(updatedProfile);
};

export default likePost;
