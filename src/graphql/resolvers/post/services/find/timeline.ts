import { UserInputError } from 'apollo-server-express';

import Following from '../../../../../entities/Following';
import { IToken } from '../../../../../interfaces/Token';
import findProfile from '../../../profiles/services/utils/findProfileUtil';
import shuffleArray from '../../../profiles/services/utils/shuffleProfilesArray';
import getTimeline from '../utils/getTimeline';

const getTimelinePosts = async (offset: number, user: IToken) => {
  if (offset % 2 === 1) {
    return [];
  }

  const loggedProfile = await findProfile(user);

  const following = await Following.findOne({ username: user.username });

  if (!following) {
    throw new UserInputError('Não está seguindo nenhum usuário');
  }

  const artists = following.artistFollowing;

  if (user.isArtist) {
    artists.push(loggedProfile._doc?._id);
  }

  const followingProfiles = shuffleArray(following.artistFollowing, following.userFollowing);

  const timeline = await getTimeline(
    offset,
    {
      postQuery: {
        artist: {
          $in: artists.map(artist => artist._id),
        },
      },
      shareQuery: {
        profile: {
          $in: followingProfiles as Array<string>,
        },
      },
    },
    user.username,
  );

  return timeline;
};

export default getTimelinePosts;
