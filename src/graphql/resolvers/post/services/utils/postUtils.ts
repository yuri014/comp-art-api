import { LeanDocument } from 'mongoose';
import Post from '../../../../../entities/Post';
import SavedPost from '../../../../../entities/SavedPost';
import Share from '../../../../../entities/Share';
import { IPost } from '../../../../../interfaces/Post';
import { IArtistProfile, IUserProfile } from '../../../../../interfaces/Profile';
import getImageHeight from './getImageHeight';

export type ILikes = Array<{
  profile: IArtistProfile | IUserProfile | string;
}>;

type IGetIsLiked = {
  postID: string;
  profileID: string;
  isShare: boolean;
};

export const getIsLiked = async ({ isShare, postID, profileID }: IGetIsLiked) => {
  if (isShare) {
    const isLiked = await Share.findById(postID)
      .select({
        likes: { $elemMatch: { profile: profileID } },
      })
      .lean();

    return isLiked?.likes && isLiked?.likes.length > 0;
  }

  const isLiked = await Post.findById(postID)
    .select({
      likes: { $elemMatch: { profile: profileID } },
    })
    .lean();

  return isLiked?.likes && isLiked?.likes.length > 0;
};

export const handlePostView = async (post: LeanDocument<IPost>, userID?: string) => {
  const imageHeight = getImageHeight(post);

  const savedPost = await SavedPost.findOne({
    user: userID,
    posts: {
      $elemMatch: {
        post: post._id,
      },
    },
  }).lean();

  return {
    isSaved: !!savedPost,
    imageHeight,
    getIsLiked,
  };
};
