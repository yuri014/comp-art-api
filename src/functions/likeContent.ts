import { UserInputError } from 'apollo-server-express';
import { Model } from 'mongoose';

import { IPost } from '../interfaces/Post';
import { IShare } from '../interfaces/Share';
import { IToken } from '../interfaces/Token';
import findProfile from '../graphql/resolvers/profiles/services/utils/findProfileUtil';

const likeContent = async (id: string, user: IToken, Entity: Model<IPost> | Model<IShare>) => {
  const getProfile = await findProfile(user);

  const profileDoc = getProfile._doc;

  if (!profileDoc) {
    throw new UserInputError('Não há perfil');
  }

  const post = await Entity.findById(id)
    .populate('likes.profile')
    .select({ likes: { $elemMatch: { profile: profileDoc._id } } });

  if (!post) {
    throw new UserInputError('Não há post');
  }

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
