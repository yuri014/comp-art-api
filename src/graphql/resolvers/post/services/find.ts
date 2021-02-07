import { UserInputError } from 'apollo-server-express';

import Following from '../../../../entities/Following';
import Post from '../../../../entities/Post';
import { FollowProfile } from '../../../../interfaces/Follow';
import { IToken } from '../../../../interfaces/Token';

// eslint-disable-next-line import/prefer-default-export
export const getTimelinePosts = async (offset: number, user: IToken) => {
  const following = await Following.find({ username: user.username });

  if (following.length === 0) {
    throw new UserInputError('Não está seguindo nenhum usuário');
  }

  const [artists] = following.map(
    profile => (profile.artistFollowing as unknown) as FollowProfile[],
  );

  if (artists.length === 0) {
    throw new UserInputError('Não está seguindo nenhum artista');
  }

  const posts = await Post.find({
    artist: {
      $in: artists.map(artist => ({ name: artist.name, username: artist.owner })),
    },
  })
    .skip(offset)
    .limit(3)
    .sort({ createdAt: -1 });

  const likes = posts.map(post => post.likes.find(like => like.username === user.username));

  if (likes.length > 0) {
    const postsView = posts.map((post, index) => ({ ...post._doc, isLiked: !!likes[index] }));
    return postsView;
  }

  return posts;
};
