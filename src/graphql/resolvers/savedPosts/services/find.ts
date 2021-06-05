import { UserInputError } from 'apollo-server-express';

import SavedPost from '../../../../entities/SavedPost';
import { IPost } from '../../../../interfaces/Post';
import { IToken } from '../../../../interfaces/Token';
import { getUserLikes, handlePostView, ILikes } from '../../post/services/utils/postUtils';

const getSavedPostsService = async (user: IToken, offset: number) => {
  const savedPosts = await SavedPost.findOne({ user: user.id })
    .skip(offset)
    .limit(10)
    .populate('posts.post')
    .slice('posts.post.1.likes', [0, 1])
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
        path: 'likes.profile',
      },
    });

  if (!savedPosts) {
    throw new UserInputError('Não há posts salvos');
  }

  const likes = getUserLikes((savedPosts.posts as unknown) as IPost[], user.username);

  const posts = savedPosts.posts.map(async ({ post }, index) => {
    const newPosts = post as IPost;
    const postDoc = newPosts._doc;
    const { imageHeight, isSaved, getIsLiked } = await handlePostView(newPosts, user.id);
    const isLiked = getIsLiked(likes as ILikes, index);

    return { ...postDoc, likes: postDoc?.likes.slice(0, 1), isLiked, isSaved, imageHeight };
  });

  return posts;
};

export default getSavedPostsService;
