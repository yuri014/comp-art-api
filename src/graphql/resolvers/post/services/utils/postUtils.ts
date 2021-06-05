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

const getIsLiked = async ({ isShare, postID, profileID }: IGetIsLiked) => {
  if (isShare) {
    const isLiked = await Share.findOne({
      _id: postID,
      likes: { $elemMatch: { profile: profileID } },
    }).lean();

    return !!isLiked;
  }

  const isLiked = await Post.findOne({
    _id: postID,
    likes: { $elemMatch: { profile: profileID } },
  }).lean();
  return !!isLiked;
};

export const handlePostView = async (post: IPost, userID?: string) => {
  const imageHeight = getImageHeight(post);

  const savedPost = await SavedPost.findOne({
    user: userID,
    posts: {
      $elemMatch: {
        post: post._id,
      },
    },
  });

  return {
    isSaved: !!savedPost,
    imageHeight,
    getIsLiked,
  };
};
