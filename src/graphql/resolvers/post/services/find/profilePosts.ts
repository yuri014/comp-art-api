import getUser from '../../../../../auth/getUser';
import ArtistProfile from '../../../../../entities/ArtistProfile';
import UserProfile from '../../../../../entities/UserProfile';
import { IOffsetTimeline } from '../../../../../interfaces/General';
import { IToken } from '../../../../../interfaces/Token';
import getTimeline from '../utils/getTimeline';

const getProfilePostsService = async (token: string, username: string, offset: IOffsetTimeline) => {
  const user = getUser(token);
  const artist = await ArtistProfile.findOne({ owner: username }).lean();
  const userProfile = await UserProfile.findOne({ owner: username }).lean();

  const profile = artist || userProfile;

  if (!profile) {
    return [];
  }

  if (user) {
    const authUser = user as IToken;

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
      profile._id,
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

export default getProfilePostsService;
