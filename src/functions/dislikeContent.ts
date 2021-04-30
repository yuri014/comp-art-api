import { Model } from 'mongoose';
import { UserInputError } from 'apollo-server-express';

import { IPost } from '../interfaces/Post';
import { IShare } from '../interfaces/Share';
import { IToken } from '../interfaces/Token';
import findProfile from '../graphql/resolvers/profiles/services/utils/findProfileUtil';

const dislikeContent = async (id: string, user: IToken, Entity: Model<IPost> | Model<IShare>) => {
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

  if (post.likes.length === 0) {
    throw new UserInputError('Não curtiu esse post');
  }

  try {
    await post.updateOne(
      {
        $pull: {
          likes: {
            profile: post.likes[0].profile,
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
