import { PubSub, UserInputError } from 'apollo-server-express';

import User from '../../../../../entities/User';
import { IToken } from '../../../../../interfaces/Token';
import createNotification from '../../../notifications/services/create';
import { follower, following } from '../update/follow';
import findProfile from '../utils/findProfileUtil';

const followService = async (userWhoFollows: IToken, username: string, pubsub: PubSub) => {
  const followedUser = await User.findOne({ username });

  if (!followedUser) {
    throw new UserInputError('Usuário não encontrado');
  }

  if (username === userWhoFollows.username) {
    throw new UserInputError('Usuário não pode se seguir');
  }

  const profileWhoIsFollowed = await findProfile(followedUser);

  const authProfile = await findProfile(userWhoFollows);

  if (!authProfile._doc || !profileWhoIsFollowed._doc) {
    throw new Error();
  }

  follower(userWhoFollows.isArtist, authProfile._doc._id, followedUser.username);

  following(followedUser.isArtist, profileWhoIsFollowed._doc._id, userWhoFollows.username);

  createNotification(
    {
      avatar: authProfile._doc.avatar,
      body: 'começou a te seguir!',
      from: userWhoFollows.username,
      link: `/profile/${userWhoFollows.username}`,
      username: followedUser.username,
    },
    pubsub,
  );

  return true;
};

export default followService;
