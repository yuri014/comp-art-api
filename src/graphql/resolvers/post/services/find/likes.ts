import { UserInputError } from 'apollo-server-express';

import Post from '../../../../../entities/Post';

const getPostLikes = async (id: string, offset: number) => {
  const post = await Post.findById(id)
    .where('likes')
    .slice([offset, offset + 8])
    .populate('likes.profile');

  if (!post) {
    throw new UserInputError('Não há post');
  }

  return post.likes.map(({ profile }) => profile);
};

export default getPostLikes;
