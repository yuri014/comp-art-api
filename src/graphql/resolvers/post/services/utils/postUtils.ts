import SavedPost from '../../../../../entities/SavedPost';
import { IPost } from '../../../../../interfaces/Post';
import { IArtistProfile, IUserProfile } from '../../../../../interfaces/Profile';
import handleInjectionSink from '../../../../../utils/handleInjectionSink';
import getImageHeight from './getImageHeight';

export type ILikes = Array<{
  profile: IArtistProfile | IUserProfile | string;
}>;

type GenericPostType = Array<{
  likes: ILikes;
}>;

export const getLikes = (posts: GenericPostType, username: string) => {
  const likes = posts.map(post => {
    const postLikes = post.likes;

    return postLikes.find(like => {
      const profile = like.profile as IUserProfile;
      return profile.owner === username;
    });
  });

  return likes;
};

export const handlePostView = async (likes: ILikes, index: number, post: IPost, userID: string) => {
  const isLiked = !!handleInjectionSink(index, likes);
  const imageHeight = getImageHeight(post);

  const savedPost = await SavedPost.findOne({
    user: userID,
    posts: {
      $elemMatch: {
        post: post._id,
      },
    },
  });

  return { isLiked, imageHeight, isSaved: !!savedPost };
};