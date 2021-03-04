import { UserInputError } from 'apollo-server-express';
import { Model } from 'mongoose';

import { IFollower, IFollowing } from '../../../../interfaces/Follow';

type IOffset = {
  offset: number;
  username: string;
};

const findFollows = async (
  FollowModel: Model<IFollower> | Model<IFollowing>,
  { offset, username }: IOffset,
) => {
  const follows = await FollowModel.findOne({ username })
    .where('artistFollowing')
    .slice([offset, offset + 8])
    .populate('artistFollowing')
    .where('userFollowing')
    .slice([offset, offset + 8])
    .populate('userFollowing');

  if (!follows) {
    throw new UserInputError('Não está seguindo ninguém');
  }

  return follows;
};

export default findFollows;
