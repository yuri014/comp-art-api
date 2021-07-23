import { FilterQuery } from 'mongoose';

import Post from '../../../../../entities/Post';
import Share from '../../../../../entities/Share';
import { IOffsetTimeline } from '../../../../../interfaces/General';
import { IPost } from '../../../../../interfaces/Post';
import { IShare } from '../../../../../interfaces/Share';
import { IToken } from '../../../../../interfaces/Token';
import getPostView from './postView';
import getImageHeight from './getImageHeight';
import { handlePostView } from './postUtils';
import sortTimelineArray from './sortTimelineArray';

type GetTimeline = (
  offset: IOffsetTimeline,
  queries: {
    postQuery: FilterQuery<IPost>;
    shareQuery: FilterQuery<IShare>;
  },
  profileID?: string,
  user?: IToken,
) => Promise<unknown[]>;

const getTimeline: GetTimeline = async (offset, queries, profileID, user) => {
  const { postQuery, shareQuery } = queries;

  const posts = await Post.find(postQuery)
    .skip(offset[0])
    .limit(5)
    .sort({ createdAt: -1 })
    .populate('artist')
    .where('likes')
    .slice([0, 3])
    .populate('likes.profile')
    .lean();

  const shares = await Share.find(shareQuery)
    .skip(offset[1])
    .limit(5)
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
    .populate('likes.profile')
    .lean();

  if (user && profileID) {
    const sharesView = await Promise.all(
      shares.map(async share => {
        if (share.post) {
          const sharePost = share.post as IPost;
          const { imageHeight, isSaved, getIsLiked } = await handlePostView(sharePost, user.id);

          const isLiked = await getIsLiked({ isShare: true, postID: share._id, profileID });

          if (!share) {
            throw new Error();
          }

          return { ...share, isLiked, imageHeight, isSaved };
        }

        return { ...share, post: { error: true } };
      }),
    );

    const postsView = await getPostView({ posts, profileID, userID: user.id });

    const timeline = sortTimelineArray(postsView, sharesView as Array<{ createdAt: string }>);

    return timeline;
  }

  const sharesView = await Promise.all(
    shares.map(async share => {
      if (share.post) {
        const sharePost = share.post as IPost;
        const imageHeight = getImageHeight(sharePost);

        if (!share) {
          throw new Error();
        }

        return { ...share, imageHeight };
      }

      return { ...share, post: { error: true } };
    }),
  );

  const postsView = await Promise.all(
    posts.map(async post => {
      const imageHeight = getImageHeight(post);

      if (!post) {
        throw new Error();
      }

      return { ...post, imageHeight };
    }),
  );

  const timeline = sortTimelineArray(postsView, sharesView as Array<{ createdAt: string }>);
  return timeline;
};

export default getTimeline;
