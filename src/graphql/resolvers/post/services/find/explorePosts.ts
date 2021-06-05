import getUser from '../../../../../auth/getUser';
import Post from '../../../../../entities/Post';
import { IToken } from '../../../../../interfaces/Token';
import findProfile from '../../../profiles/services/utils/findProfileUtil';

const getExplorePostsService = async (offset: number, token: string) => {
  const user = getUser(token) as IToken;

  if (user) {
    const profile = await findProfile(user);

    const profileDoc = profile._doc;

    const posts = await Post.find({
      artist: {
        $ne: profileDoc?._id,
      },
      likes: {
        $ne: profileDoc?._id,
      },
    })
      .skip(offset)
      .limit(6)
      .sort({ createdAt: -1 })
      .populate('artist')
      .where('likes')
      .slice([0, 3])
      .populate('likes.profile');

    return posts;
  }

  const posts = await Post.find()
    .skip(offset)
    .limit(6)
    .sort({ createdAt: -1 })
    .populate('artist')
    .where('likes')
    .slice([0, 3])
    .populate('likes.profile');

  return posts;
};

export default getExplorePostsService;
