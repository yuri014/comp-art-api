import { IProfileModel } from '../../../../../interfaces/Models';

interface DecrementFollow {
  follower: string[] | undefined;
  Entity: IProfileModel;
  field: string;
}

const decrementFollow = async ({ follower, Entity, field }: DecrementFollow) => {
  if (follower) {
    await Promise.all(
      follower.map(async (id: string) => {
        // @ts-ignore
        await Entity.findByIdAndUpdate(
          id,
          {
            $inc: {
              [field]: -1,
            },
          },
          { useFindAndModify: false },
        );
      }),
    );
  }
};

export default decrementFollow;
