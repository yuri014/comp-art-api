import { UserInputError } from 'apollo-server-express';

import SavedPost from '../../../../entities/SavedPost';
import { IPost } from '../../../../interfaces/Post';
import { IToken } from '../../../../interfaces/Token';

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

  const posts = savedPosts.posts.map(({ post }) => {
    const newPosts = post as IPost;
    const postDoc = newPosts._doc;

    return { ...postDoc, likes: postDoc?.likes.slice(0, 1) };
  });

  return posts;
};

export default getSavedPostsService;
