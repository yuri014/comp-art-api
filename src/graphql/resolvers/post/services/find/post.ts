import getUser from '../../../../../auth/getUser';
import Post from '../../../../../entities/Post';
import { IToken } from '../../../../../interfaces/Token';
import findProfile from '../../../profiles/services/utils/findProfileUtil';
import getImageHeight from '../utils/getImageHeight';
import { handlePostView } from '../utils/postUtils';

const getPostService = async (id: string, token: string) => {
  const user = getUser(token);
  const post = await Post.findById(id)
    .populate('artist')
    .where('likes')
    .slice([0, 3])
    .populate('likes.profile')
    .lean();

  if (!post) {
    return {};
  }

  if (user) {
    const authUser = user as IToken;

    const profile = await findProfile(authUser);

    const { isSaved, imageHeight, getIsLiked } = await handlePostView(post, authUser.id);
    const isLiked = await getIsLiked({ isShare: false, postID: id, profileID: profile._id });

    return { ...post, isLiked: !!isLiked, isSaved, imageHeight };
  }

  const imageHeight = getImageHeight(post);

  return { ...post, imageHeight };
};

export default getPostService;
