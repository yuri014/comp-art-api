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
  queryParams: Array<string>,
) => {
  const follows = await FollowModel.findOne({ username })
    .where(queryParams[0])
    .slice([offset > 0 ? Math.round(offset / 2) : offset, offset + 4])
    .populate(queryParams[0])
    .where(queryParams[1])
    .slice([offset > 0 ? Math.round(offset / 2) : offset, offset + 4])
    .populate(queryParams[1]);

  if (!follows) {
    throw new UserInputError('Não está seguindo ninguém');
  }

  return follows;
};

export default findFollows;
