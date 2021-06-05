import getUser from '../../../../../auth/getUser';
import ArtistProfile from '../../../../../entities/ArtistProfile';
import { IToken } from '../../../../../interfaces/Token';
import getTimeline from '../utils/getTimeline';

const getProfilePostsService = async (token: string, username: string, offset: number) => {
  const user = getUser(token);
  const profile = await ArtistProfile.findOne({ owner: username });

  if (!profile) {
    return [];
  }

  if (user) {
    const authUser = user as IToken;

    const timeline = await getTimeline(
      offset,
      {
        postQuery: {
          artist: profile._doc?._id,
        },
        shareQuery: {
          profile: profile._doc?._id,
        },
      },
      profile._doc?._id,
      authUser,
    );

    return timeline;
  }

  const timeline = await getTimeline(offset, {
    postQuery: {
      artist: profile._doc?._id,
    },
    shareQuery: {
      profile: profile._doc?._id,
    },
  });

  return timeline;
};

export default getProfilePostsService;
