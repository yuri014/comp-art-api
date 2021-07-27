import { Model } from 'mongoose';

import { IFollower, IFollowing } from '../../../../../interfaces/Follow';

export type IOffset = {
  offset: number[];
  username: string;
};

const findFollows = async (
  FollowModel: Model<IFollower> | Model<IFollowing>,
  { offset, username }: IOffset,
  queryParams: Array<string>,
) => {
  const follows = await FollowModel.findOne({ username })
    .where(queryParams[0])
    .slice([offset[0], offset[0] + 6])
    .populate(queryParams[0])
    .where(queryParams[1])
    .slice([offset[1], offset[1] + 6])
    .populate(queryParams[1]);

  if (!follows) {
    return [];
  }

  return follows;
};

export default findFollows;
