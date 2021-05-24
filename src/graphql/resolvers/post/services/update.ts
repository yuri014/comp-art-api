import { PubSub } from 'apollo-server-express';

import ArtistProfile from '../../../../entities/ArtistProfile';
import Post from '../../../../entities/Post';
import UserProfile from '../../../../entities/UserProfile';
import levelUp from '../../../../functions/levelUp';
import { IPost } from '../../../../interfaces/Post';
import { IArtistProfile } from '../../../../interfaces/Profile';
import { IToken } from '../../../../interfaces/Token';
import genericUpdateOptions from '../../../../utils/genericUpdateOptions';
import likeHandler from '../../../../utils/likeHandle';
import xpValues from '../../../../utils/xpValues';
import createNotification from '../../notifications/services/update';

const likePost = async (id: string, user: IToken, pubsub: PubSub) => {
  await likeHandler(id, user, Post, 'like');

  const artist = (await Post.findById(id).populate('artist', 'owner')) as IPost;

  const { owner } = artist?.artist as IArtistProfile;

  await createNotification(
    {
      body: 'teste',
      link: 'teste-link',
      title: 'titulo',
      username: owner,
    },
    pubsub,
  );

  const { likeXP } = xpValues;

  if (user.isArtist) {
    const updatedProfile = await ArtistProfile.findOneAndUpdate(
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

    return levelUp(updatedProfile);
  }

  const updatedProfile = await UserProfile.findOneAndUpdate(
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

  return levelUp(updatedProfile);
};

export default likePost;
