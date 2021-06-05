import { FilterQuery } from 'mongoose';

import Post from '../../../../../entities/Post';
import Share from '../../../../../entities/Share';
import { IPost } from '../../../../../interfaces/Post';
import { IShare } from '../../../../../interfaces/Share';
import { IToken } from '../../../../../interfaces/Token';
import shuffleArray from '../../../profiles/services/utils/shuffleProfilesArray';
import getImageHeight from './getImageHeight';
import { getUserLikes, handlePostView, ILikes } from './postUtils';

type GetTimeline = (
  offset: number,
  queries: {
    postQuery: FilterQuery<IPost>;
    shareQuery: FilterQuery<IShare>;
  },
  user?: IToken,
) => Promise<unknown[]>;

const getTimeline: GetTimeline = async (offset, queries, user) => {
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

  if (user) {
    const likes = getUserLikes(posts, user.username);
    const shareLikes = getUserLikes(shares, user.username);

    const sharesView = shares.map(async (share, index) => {
      const sharePost = share.post as IPost;
      const { imageHeight, isSaved, getIsLiked } = await handlePostView(sharePost, user.id);

      const isLiked = getIsLiked(shareLikes as ILikes, index);

      return { ...share._doc, isLiked, imageHeight, isSaved };
    });

    const postsView = posts.map(async (post, index) => {
      const { imageHeight, isSaved, getIsLiked } = await handlePostView(post, user.id);
      const isLiked = getIsLiked(likes as ILikes, index);

      return { ...post._doc, isLiked, imageHeight, isSaved };
    });

    const timeline = shuffleArray(postsView, sharesView);
    return timeline;
  }

  const sharesView = shares.map(async share => {
    const sharePost = share.post as IPost;
    const imageHeight = getImageHeight(sharePost);

    return { ...share._doc, imageHeight };
  });

  const postsView = posts.map(async post => {
    const imageHeight = getImageHeight(post);

    return { ...post._doc, imageHeight };
  });

  const timeline = shuffleArray(postsView, sharesView);
  return timeline;
};

export default getTimeline;
