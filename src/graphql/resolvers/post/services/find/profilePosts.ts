import getUser from '../../../../../auth/getUser';
import ArtistProfile from '../../../../../entities/ArtistProfile';
import getTimeline from '../utils/getTimeline';

const getProfilePostsService = async (token: string, username: string, offset: number) => {
  const user = getUser(token);
  const profile = await ArtistProfile.findOne({ owner: username });

  if (profile) {
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
      user.username,
    );

    return timeline;
  }
  return [];
};

export default getProfilePostsService;
