import getUser from '../../../../../auth/getUser';
import Post from '../../../../../entities/Post';
import { IProfileEntity } from '../../../../../interfaces/Models';
import { IToken } from '../../../../../interfaces/Token';
import getImageHeight from '../utils/getImageHeight';
import { handlePostView } from '../utils/postUtils';

const getPostService = async (id: string, token: string) => {
  const user = getUser(token);
  const post = await Post.findById(id)
    .populate('artist')
    .where('likes')
    .slice([0, 3])
    .populate('likes.profile');

  if (!post) {
    return {};
  }

  if (user) {
    const authUser = user as IToken;

    const isLiked = post.likes.find(like => {
      const profile = like.profile as IProfileEntity;

      return profile.owner === authUser.username;
    });

    const { isSaved, imageHeight } = await handlePostView(post, authUser.id);

    return { ...post._doc, isLiked: !!isLiked, isSaved, imageHeight };
  }

  const imageHeight = getImageHeight(post);

  return { ...post._doc, imageHeight };
};

export default getPostService;
