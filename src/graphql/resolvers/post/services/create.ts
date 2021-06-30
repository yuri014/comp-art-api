import { AuthenticationError, UserInputError } from 'apollo-server-express';

import ArtistProfile from '../../../../entities/ArtistProfile';
import levelUp from '../../../../functions/levelUp';
import { IPostInput } from '../../../../interfaces/Post';
import { IToken } from '../../../../interfaces/Token';
import checkAbilityToPost from '../../../../middlewares/checkAbilityToPost';
import xpValues from '../../../../utils/xpValues';
import postValidationSchema from '../../../../validators/postSchema';
import { createMediaPost, createTextPost } from './utils/handlePostCreation';

const createNewPost = async (post: IPostInput, user: IToken) => {
  if (!user.isArtist) {
    throw new AuthenticationError('Somente artistas podem postar');
  }

  const profile = await checkAbilityToPost(user.username);

  const profileDoc = profile._doc;

  if (!profileDoc) {
    throw new UserInputError('Não há perfil');
  }

  const errors = postValidationSchema.validate({
    description: post.description,
    alt: post.alt,
    title: post.title,
  });

  if (errors.error) {
    throw new UserInputError(errors.error.message);
  }

  if (await post.body) {
    await createMediaPost(post, profileDoc._id);
  } else {
    await createTextPost(profileDoc._id, post.description);
  }

  await profile.updateOne({ isBlockedToPost: true, postsRemainingToUnblock: 3 });

  const { postXP } = xpValues;

  const updatedProfile = await ArtistProfile.findOneAndUpdate(
    { owner: profile.owner },
    { $inc: { postCount: 1, xp: postXP } },
    { useFindAndModify: false, new: true },
  );

  if (!updatedProfile) {
    throw new Error();
  }

  return levelUp(updatedProfile);
};

export default createNewPost;
