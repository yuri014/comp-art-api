import { UserInputError } from 'apollo-server-express';
import User from '../../../../../entities/User';
import { IToken } from '../../../../../interfaces/Token';
import { follower, following } from '../update/follow';
import findProfile from '../utils/findProfileUtil';

const followService = async (userWhoFollows: IToken, username: string) => {
  const followedUser = await User.findOne({ username });

  if (!followedUser) {
    throw new UserInputError('Usuário não encontrado', {
      errors: 'Usuário não encontrado',
    });
  }

  if (username === userWhoFollows.username) {
    throw new UserInputError('Usuário não pode se seguir', {
      errors: 'Usuário não pode se seguir',
    });
  }

  const profileWhoIsFollowed = await findProfile(followedUser);

  const authProfile = await findProfile(userWhoFollows);

  if (!authProfile._doc || !profileWhoIsFollowed._doc) {
    throw new Error();
  }

  await follower(userWhoFollows.isArtist, authProfile._doc._id, followedUser.username);

  await following(followedUser.isArtist, profileWhoIsFollowed._doc._id, userWhoFollows.username);

  return true;
};

export default followService;
