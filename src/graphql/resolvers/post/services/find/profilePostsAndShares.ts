import getUser from '../../../../../auth/getUser';
import ArtistProfile from '../../../../../entities/ArtistProfile';
import UserProfile from '../../../../../entities/UserProfile';
import { IOffsetTimeline } from '../../../../../interfaces/General';
import { IToken } from '../../../../../interfaces/Token';
import findProfile from '../../../profiles/services/utils/findProfileUtil';
import getTimeline from '../utils/getTimeline';

const getProfilePostsAndSharesService = async (
  token: string,
  username: string,
  offset: IOffsetTimeline,
) => {
  const user = getUser(token);
  const artist = await ArtistProfile.findOne({ owner: username }).lean();
  const userProfile = await UserProfile.findOne({ owner: username }).lean();

  const profile = artist || userProfile;

  if (!profile) {
    return [];
  }

  if (user) {
    const authUser = user as IToken;

    const loggedProfile = await findProfile(authUser, true);

    const timeline = await getTimeline(
      offset,
      {
        postQuery: {
          artist: profile._id,
        },
        shareQuery: {
          profile: profile._id,
        },
      },
      loggedProfile._id,
      authUser,
    );

    return timeline;
  }

  const timeline = await getTimeline(offset, {
    postQuery: {
      artist: profile?._id,
    },
    shareQuery: {
      profile: profile?._id,
    },
  });

  return timeline;
};

export default getProfilePostsAndSharesService;
