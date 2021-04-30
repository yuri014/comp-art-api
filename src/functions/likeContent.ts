import { UserInputError } from 'apollo-server-express';

import { IPost } from '../interfaces/Post';
import { IArtistProfile, IUserProfile } from '../interfaces/Profile';
import { IShare } from '../interfaces/Share';
import { IToken } from '../interfaces/Token';

const likeContent = async (
  post: IShare | IPost,
  profileDoc: IArtistProfile | IUserProfile,
  user: IToken,
) => {
  if (post.likes.length > 0) {
    throw new UserInputError('Já curtiu esse post');
  }

  try {
    await post.updateOne(
      {
        $push: {
          likes: {
            $position: 0,
            $each: [
              {
                profile: profileDoc._id as string,
                onModel: user.isArtist ? 'ArtistProfile' : 'UserProfile',
              },
            ],
          },
        },
        $inc: {
          likesCount: 1,
        },
      },
      { useFindAndModify: false },
    );
  } catch (error) {
    throw new Error(error);
  }
};

export default likeContent;
