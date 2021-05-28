import getUser from '../../../../../auth/getUser';
import Post from '../../../../../entities/Post';

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

    return { ...post._doc, isLiked: !!isLiked };
  }

  return {};
};

export default getPostService;
