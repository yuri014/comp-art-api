import { LeanDocument } from 'mongoose';

import { handlePostView } from './postUtils';
import { IPost } from '../../../../../interfaces/Post';

interface IGetPostView {
  posts: LeanDocument<IPost>[];
  userID: string;
  profileID: string;
}

const getPostView = async (options: IGetPostView) => {
  const { posts, profileID, userID } = options;

  const postsView = await Promise.all(
    posts.map(async post => {
      const { imageHeight, isSaved, getIsLiked } = await handlePostView(post, userID);
      const isLiked = await getIsLiked({ isShare: false, postID: post._id, profileID });

      if (!post) {
        throw new Error();
      }

      return { ...post, isLiked, imageHeight, isSaved };
    }),
  );

  return postsView;
};

export default getPostView;
