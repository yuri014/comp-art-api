import { UserInputError } from 'apollo-server-express';

import ArtistProfile from '../../../../entities/ArtistProfile';
import Following from '../../../../entities/Following';
import Post from '../../../../entities/Post';
import { FollowProfile } from '../../../../interfaces/Follow';
import { IToken } from '../../../../interfaces/Token';
import getUser from '../../../../utils/getUser';

export const getPostService = async (id: string, token: string) => {
  const user = getUser(token);
  const post = await Post.findById(id);

  if (post) {
    const isLiked = post.likes.find(like => like.username === user.username);

    return { ...post._doc, isLiked: !!isLiked };
  }

  return {};
};

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

export const getProfilePostsService = async (token: string, username: string, offset: number) => {
  const user = getUser(token);
  const profile = await ArtistProfile.findOne({ owner: username });

  if (profile) {
    const posts = await Post.find({
      artist: {
        name: profile.name,
        username,
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
  }
  return [];
};
