import { UserInputError } from 'apollo-server-express';

import getUser from '../../../../auth/getUser';
import ArtistProfile from '../../../../entities/ArtistProfile';
import Following from '../../../../entities/Following';
import Post from '../../../../entities/Post';
import { IToken } from '../../../../interfaces/Token';
import findProfile from '../../profiles/services/utils/findProfileUtil';
import shuffleArray from '../../profiles/services/utils/shuffleProfilesArray';
import getTimeline from './utils/getTimeline';

export const getPostService = async (id: string, token: string) => {
  const user = getUser(token);
  const post = await Post.findById(id)
    .populate('artist')
    .populate('likes.profile')
    .where('likes')
    .slice([0, 3]);

  if (post) {
    // @ts-ignore
    const isLiked = post.likes.find(like => like.profile.owner === user.username);

    return { ...post._doc, isLiked: !!isLiked };
  }

  return {};
};

export const getTimelinePosts = async (offset: number, user: IToken) => {
  if (offset % 2 === 1) {
    return [];
  }

  const loggedProfile = await findProfile(user);

  const following = await Following.findOne({ username: user.username });

  if (!following) {
    throw new UserInputError('Não está seguindo nenhum usuário');
  }

  const artists = following.artistFollowing;

  if (user.isArtist) {
    artists.push(loggedProfile._doc?._id);
  }

  const followingProfiles = shuffleArray(following.artistFollowing, following.userFollowing);

  const timeline = await getTimeline(
    offset,
    {
      postQuery: {
        artist: {
          $in: artists.map(artist => artist._id),
        },
      },
      shareQuery: {
        profile: {
          $in: followingProfiles as Array<string>,
        },
      },
    },
    user.username,
  );

  return timeline;
};

export const getProfilePostsService = async (token: string, username: string, offset: number) => {
  const user = getUser(token);
  const profile = await ArtistProfile.findOne({ owner: username });

  if (profile) {
    const timeline = await getTimeline(
      offset,
      {
        postQuery: {
          artist: profile._id,
        },
        shareQuery: {
          profile: profile._id,
        },
      },
      user.username,
    );

    return timeline;
  }
  return [];
};

export const getExplorePostsService = async (offset: number, token: string) => {
  const user = getUser(token) as IToken;

  if (user.username) {
    const profile = await findProfile(user);

    const profileDoc = profile._doc;

    const posts = await Post.find({
      artist: {
        $ne: profileDoc?._id,
      },
      likes: {
        $ne: profileDoc?._id,
      },
    })
      .skip(offset)
      .limit(6)
      .sort({ createdAt: -1 })
      .populate('artist')
      .populate('likes.profile')
      .where('likes')
      .slice([0, 3]);

    return posts;
  }

  const posts = await Post.find()
    .skip(offset)
    .limit(6)
    .sort({ createdAt: -1 })
    .populate('artist')
    .populate('likes.profile')
    .where('likes')
    .slice([0, 3]);

  return posts;
};

export const getPostLikes = async (id: string, offset: number) => {
  const post = await Post.findById(id)
    .populate('likes.profile')
    .where('likes')
    .slice([offset, offset + 8]);

  if (!post) {
    throw new UserInputError('Não há post');
  }

  return post.likes.map(({ profile }) => profile);
};
