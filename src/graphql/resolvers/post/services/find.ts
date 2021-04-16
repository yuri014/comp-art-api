/* eslint-disable function-paren-newline */
import { UserInputError } from 'apollo-server-express';

import ArtistProfile from '../../../../entities/ArtistProfile';
import Following from '../../../../entities/Following';
import Post from '../../../../entities/Post';
import Share from '../../../../entities/Share';
import { IArtistProfile, IUserProfile } from '../../../../interfaces/Profile';
import { IToken } from '../../../../interfaces/Token';
import getUser from '../../../../utils/getUser';
import findProfile from '../../profiles/services/utils/findProfileUtil';
import shuffleArray from '../../profiles/services/utils/shuffleProfilesArray';

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

  const newOffset = offset > 0 ? offset / 2 : 0;

  const following = await Following.findOne({ username: user.username });

  if (!following) {
    throw new UserInputError('Não está seguindo nenhum usuário');
  }

  const artists = following.artistFollowing;

  const followingProfiles = shuffleArray(artists, following.userFollowing);

  const posts = await Post.find({
    artist: {
      $in: artists.map(artist => artist._id),
    },
  })
    .skip(newOffset)
    .limit(3)
    .sort({ createdAt: -1 })
    .populate('artist')
    .populate('likes.profile')
    .where('likes')
    .slice([0, 3]);

  const shares = await Share.find({
    profile: {
      $in: followingProfiles as Array<string>,
    },
  })
    .skip(newOffset)
    .limit(3)
    .sort({ createdAt: -1 })
    .populate('post')
    .populate('profile')
    .populate({
      path: 'post',
      populate: {
        path: 'artist',
      },
    })
    .populate('likes.profile')
    .where('likes')
    .slice([0, 3]);

  const likes = posts.map(post =>
    post.likes.find(like => {
      const profile = like.profile as IArtistProfile;
      return profile.owner === user.username;
    }),
  );

  const shareLikes = shares.map(share =>
    share.likes.find(like => {
      const profile = like.profile as IUserProfile;
      return profile.owner === user.username;
    }),
  );

  if (likes.length > 0 || shareLikes.length > 0) {
    const sharesView = shares.map((share, index) => ({ ...share._doc, isLiked: !!likes[index] }));
    const postsView = posts.map((post, index) => ({ ...post._doc, isLiked: !!likes[index] }));
    const timeline = shuffleArray(postsView, sharesView);
    return timeline;
  }
  return shuffleArray(posts, shares);
};

export const getProfilePostsService = async (token: string, username: string, offset: number) => {
  const user = getUser(token);
  const profile = await ArtistProfile.findOne({ owner: username });

  if (profile) {
    const posts = await Post.find({
      artist: profile._id,
    })
      .skip(offset)
      .limit(3)
      .sort({ createdAt: -1 })
      .populate('likes.profile')
      .populate('artist')
      .where('likes')
      .slice([0, 3]);

    // @ts-ignore
    const likes = posts.map(post => post.likes.find(like => like.profile.owner === user.username));

    if (likes.length > 0) {
      const postsView = posts.map((post, index) => ({ ...post._doc, isLiked: !!likes[index] }));
      return postsView;
    }

    return posts;
  }
  return [];
};

export const getExplorePostsService = async (offset: number, token: string) => {
  const user = getUser(token) as IToken;

  if (user.username) {
    const profile = await findProfile(user);

    const posts = await Post.find({
      artist: {
        $not: {
          $ne: profile._id,
        },
      },
      likes: {
        $not: profile._id,
      },
    })
      .skip(offset)
      .limit(3)
      .sort({ createdAt: -1 })
      .populate('artist')
      .populate('likes.profile')
      .where('likes')
      .slice([0, 3]);

    return posts;
  }

  const posts = await Post.find()
    .skip(offset)
    .limit(3)
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
