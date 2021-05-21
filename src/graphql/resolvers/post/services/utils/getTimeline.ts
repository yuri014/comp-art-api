import { FilterQuery } from 'mongoose';

import Post from '../../../../../entities/Post';
import Share from '../../../../../entities/Share';
import { IPost } from '../../../../../interfaces/Post';
import { IArtistProfile, IUserProfile } from '../../../../../interfaces/Profile';
import { IShare } from '../../../../../interfaces/Share';
import handleInjectionSink from '../../../../../utils/handleInjectionSink';
import shuffleArray from '../../../profiles/services/utils/shuffleProfilesArray';
import getImageHeight from './getImageHeight';

type GenericPostType = Array<{
  likes: Array<{
    profile: IArtistProfile | IUserProfile | string;
  }>;
}>;

const getLikes = (posts: GenericPostType, username: string) => {
  const likes = posts.map(post => {
    const postLikes = post.likes;

    return postLikes.find(like => {
      const profile = like.profile as IUserProfile;
      return profile.owner === username;
    });
  });

  return likes;
};

type GetTimeline = (
  offset: number,
  queries: {
    postQuery: FilterQuery<IPost>;
    shareQuery: FilterQuery<IShare>;
  },
  username: string,
) => Promise<unknown[]>;

const getTimeline: GetTimeline = async (offset, queries, username) => {
  const newOffset = offset > 0 ? offset / 2 : 0;
  const { postQuery, shareQuery } = queries;

  const posts = await Post.find(postQuery)
    .skip(newOffset)
    .limit(3)
    .sort({ createdAt: -1 })
    .populate('artist')
    .populate('likes.profile')
    .where('likes')
    .slice([0, 3]);

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
    .populate('likes.profile')
    .where('likes')
    .slice([0, 3]);

  const likes = getLikes(posts, username);

  const shareLikes = getLikes(shares, username);

  if (likes.length > 0 || shareLikes.length > 0) {
    const sharesView = shares.map((share, index) => {
      const isLiked = !!handleInjectionSink(index, shareLikes);
      const sharePost = share.post as IPost;

      const imageHeight = getImageHeight(sharePost);
      return { ...share._doc, isLiked, imageHeight };
    });

    const postsView = posts.map((post, index) => {
      const isLiked = !!handleInjectionSink(index, likes);

      const imageHeight = getImageHeight(post);
      return { ...post._doc, isLiked, imageHeight };
    });

    const timeline = shuffleArray(postsView, sharesView);
    return timeline;
  }

  return shuffleArray(posts, shares);
};

export default getTimeline;