import getUser from '../../../../../auth/getUser';
import Post from '../../../../../entities/Post';
import { IToken } from '../../../../../interfaces/Token';
import findProfile from '../../../profiles/services/utils/findProfileUtil';
import getImageHeight from '../utils/getImageHeight';
import { handlePostView } from '../utils/postUtils';

const getExplorePostsService = async (offset: number, token: string) => {
  const user = getUser(token) as IToken;

  if (user) {
    const profile = await findProfile(user);

    const profileDoc = profile._doc;

    const posts = await Post.find({
      artist: {
        $ne: profileDoc?._id,
      },
      'likes.profile': { $ne: profileDoc?._id },
    })
      .skip(offset)
      .limit(6)
      .sort({ createdAt: -1 })
      .populate('artist')
      .where('likes')
      .slice([0, 3])
      .populate('likes.profile');

    const postView = await Promise.all(
      posts.map(async post => {
        const { imageHeight, isSaved } = await handlePostView(post, user.id);

        return { ...post._doc, imageHeight, isSaved };
      }),
    );

    return postView;
  }

  const posts = await Post.find()
    .skip(offset)
    .limit(6)
    .sort({ createdAt: -1 })
    .populate('artist')
    .where('likes')
    .slice([0, 3])
    .populate('likes.profile');

  const postView = posts.map(post => {
    const imageHeight = getImageHeight(post);

    return { ...post._doc, imageHeight };
  });

  return postView;
};

export default getExplorePostsService;
