import getUser from '../../../../../auth/getUser';
import Post from '../../../../../entities/Post';
import { handlePostView } from '../utils/postUtils';

const getPostService = async (id: string, token: string) => {
  const user = getUser(token);
  const post = await Post.findById(id)
    .populate('artist')
    .populate('likes.profile')
    .where('likes')
    .slice([0, 3]);

  if (post) {
    // @ts-ignore
    const isLiked = post.likes.find(like => like.profile.owner === user.username);
    const { isSaved, imageHeight } = await handlePostView(post, user.id);

    return { ...post._doc, isLiked: !!isLiked, isSaved, imageHeight };
  }

  return {};
};

export default getPostService;
