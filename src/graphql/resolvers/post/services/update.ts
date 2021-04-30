import ArtistProfile from '../../../../entities/ArtistProfile';

import Post from '../../../../entities/Post';
import UserProfile from '../../../../entities/UserProfile';
import levelUp from '../../../../functions/levelUp';
import likeContent from '../../../../functions/likeContent';
import { IToken } from '../../../../interfaces/Token';
import genericUpdateOptions from '../../../../utils/genericUpdateOptions';
import xpValues from '../../../../utils/xpValues';

const likePost = async (id: string, user: IToken) => {
  await likeContent(id, user, Post);

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
