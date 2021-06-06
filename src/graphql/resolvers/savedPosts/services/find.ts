import { UserInputError } from 'apollo-server-express';

import SavedPost from '../../../../entities/SavedPost';
import { IPost } from '../../../../interfaces/Post';
import { IShare } from '../../../../interfaces/Share';
import { IToken } from '../../../../interfaces/Token';
import getImageHeight from '../../post/services/utils/getImageHeight';
import { getIsLiked } from '../../post/services/utils/postUtils';
import findProfile from '../../profiles/services/utils/findProfileUtil';

const getSavedPostsService = async (user: IToken, offset: number) => {
  const savedPosts = await SavedPost.findOne({ user: user.id })
    .skip(offset)
    .limit(10)
    .populate({
      path: 'posts.post',
      populate: {
        path: 'artist',
      },
    })
    .populate({
      path: 'posts.post',
      populate: {
        path: 'profile',
      },
    })
    .populate({
      path: 'posts.post',
      populate: {
        path: 'post',
        populate: {
          path: 'artist',
        },
      },
    })
    .populate({
      path: 'posts.post',
      populate: {
        path: 'likes.profile',
      },
    })
    .lean();

  const profile = await findProfile(user);

  if (!savedPosts) {
    throw new UserInputError('Não há posts salvos');
  }

  const posts = await Promise.all(
    savedPosts.posts.map(async ({ post }) => {
      const newPosts = post as IPost;

      const handleImageHeight = () => {
        if (newPosts.artist) {
          return getImageHeight(newPosts);
        }

        const share = post as IShare;
        const sharedPost = share.post as IPost;

        return getImageHeight(sharedPost);
      };

      const imageHeight = handleImageHeight();

      const isLiked = await getIsLiked({
        isShare: !newPosts.artist,
        postID: newPosts._id,
        profileID: profile._doc?._id,
      });

      return {
        ...newPosts,
        likes: newPosts?.likes.slice(0, 1),
        isLiked,
        isSaved: true,
        imageHeight,
      };
    }),
  );

  return posts;
};

export default getSavedPostsService;
