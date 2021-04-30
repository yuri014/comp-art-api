import { UserInputError } from 'apollo-server-express';

import { IPost } from '../interfaces/Post';
import { IArtistProfile, IUserProfile } from '../interfaces/Profile';
import { IShare } from '../interfaces/Share';

const dislikeContent = async (post: IShare | IPost, profileDoc: IArtistProfile | IUserProfile) => {
  if (post.likes.length === 0) {
    throw new UserInputError('Não curtiu esse post');
  }

  try {
    await post.updateOne(
      {
        $pull: {
          likes: {
            profile: profileDoc._id as string,
          },
        },
        $inc: {
          likesCount: -1,
        },
      },
      { useFindAndModify: false },
    );
  } catch (error) {
    throw new Error(error);
  }
};

export default dislikeContent;
