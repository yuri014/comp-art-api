import { handlePostView } from './postUtils';
import { IPost } from '../../../../../interfaces/Post';

interface IGetPostView {
  posts: IPost[];
  userID: string;
  profileID: string;
}

const getPostView = async (options: IGetPostView) => {
  const { posts, profileID, userID } = options;

  const postsView = await Promise.all(
    posts.map(async post => {
      const { imageHeight, isSaved, getIsLiked } = await handlePostView(post, userID);
      const isLiked = await getIsLiked({ isShare: false, postID: post._id, profileID });

      if (!post._doc) {
        throw new Error();
      }

      return { ...post._doc, isLiked, imageHeight, isSaved };
    }),
  );

  return postsView;
};

export default getPostView;
