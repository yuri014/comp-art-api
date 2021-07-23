import Following from '../../../../../entities/Following';
import { IOffsetTimeline } from '../../../../../interfaces/General';
import { IToken } from '../../../../../interfaces/Token';
import findProfile from '../../../profiles/services/utils/findProfileUtil';
import shuffleProfileArray from '../../../profiles/services/utils/shuffleProfilesArray';
import getTimeline from '../utils/getTimeline';

const getTimelinePosts = async (offset: IOffsetTimeline, user: IToken) => {
  const loggedProfile = await findProfile(user);

  const following = await Following.findOne({ username: user.username }).lean();

  if (!following) {
    return [];
  }

  const artists = following.artistFollowing;

  const followingProfiles = shuffleProfileArray(following.artistFollowing, following.userFollowing);

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
    loggedProfile._doc?._id,
    user,
  );

  return timeline;
};

export default getTimelinePosts;
