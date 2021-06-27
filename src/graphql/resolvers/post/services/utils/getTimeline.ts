import { FilterQuery } from 'mongoose';

import Post from '../../../../../entities/Post';
import Share from '../../../../../entities/Share';
import { IPost } from '../../../../../interfaces/Post';
import { IShare } from '../../../../../interfaces/Share';
import { IToken } from '../../../../../interfaces/Token';
import getImageHeight from './getImageHeight';
import { handlePostView } from './postUtils';
import sortTimelineArray from './sortTimelineArray';

type GetTimeline = (
  offset: number,
  queries: {
    postQuery: FilterQuery<IPost>;
    shareQuery: FilterQuery<IShare>;
  },
  profileID?: string,
  user?: IToken,
) => Promise<unknown[]>;

const getTimeline: GetTimeline = async (offset, queries, profileID, user) => {
  const newOffset = offset > 0 ? offset / 2 : 0;
  const { postQuery, shareQuery } = queries;

  const posts = await Post.find(postQuery)
    .skip(newOffset)
    .limit(3)
    .sort({ createdAt: -1 })
    .populate('artist')
    .where('likes')
    .slice([0, 3])
    .populate('likes.profile');

  const shares = await Share.find(shareQuery)
    .skip(newOffset)
    .limit(3)
    .sort({ createdAt: -1 })
    .populate('post')
    .populate('profile')
    .populate({
      path: 'post',
      populate: {
        path: 'artist',
      },
    })
    .where('likes')
    .slice([0, 3])
    .populate('likes.profile');

  if (user && profileID) {
    const sharesView = await Promise.all(
      shares.map(async share => {
        const sharePost = share.post as IPost;
        const { imageHeight, isSaved, getIsLiked } = await handlePostView(sharePost, user.id);

        const isLiked = await getIsLiked({ isShare: true, postID: share._id, profileID });

        if (!share._doc) {
          throw new Error();
        }

        return { ...share._doc, isLiked, imageHeight, isSaved };
      }),
    );

    const postsView = await Promise.all(
      posts.map(async post => {
        const { imageHeight, isSaved, getIsLiked } = await handlePostView(post, user.id);
        const isLiked = await getIsLiked({ isShare: false, postID: post._id, profileID });

        if (!post._doc) {
          throw new Error();
        }

        return { ...post._doc, isLiked, imageHeight, isSaved };
      }),
    );

    const timeline = sortTimelineArray(postsView, sharesView);
    return timeline;
  }

  const sharesView = await Promise.all(
    shares.map(async share => {
      const sharePost = share.post as IPost;
      const imageHeight = getImageHeight(sharePost);

      if (!share._doc) {
        throw new Error();
      }

      return { ...share._doc, imageHeight };
    }),
  );

  const postsView = await Promise.all(
    posts.map(async post => {
      const imageHeight = getImageHeight(post);

      if (!post._doc) {
        throw new Error();
      }

      return { ...post._doc, imageHeight };
    }),
  );

  const timeline = sortTimelineArray(postsView, sharesView);
  return timeline;
};

export default getTimeline;
