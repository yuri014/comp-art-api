import { UserInputError } from 'apollo-server-express';
import { PostEntity } from '../interfaces/Models';
import { IToken } from '../interfaces/Token';
import dislikeContent from '../functions/dislikeContent';
import likeContent from '../functions/likeContent';
import findProfile from '../graphql/resolvers/profiles/services/utils/findProfileUtil';

/**
 * Valida a regra de negócio de likes, é responsável por chamar a função de like ou dislike.
 */
const likeHandler = async (
  id: string,
  user: IToken,
  Entity: PostEntity,
  like: 'like' | 'dislike',
) => {
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

  if (like === 'like') {
    likeContent(post, profileDoc, user);
  } else {
    dislikeContent(post, profileDoc);
  }
};

export default likeHandler;
