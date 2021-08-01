import { AuthenticationError, PubSub, UserInputError } from 'apollo-server-express';

import ArtistProfile from '../../../../entities/ArtistProfile';
import levelUp from '../../../../functions/levelUp';
import mentionUser from '../../../../functions/mentionUser';
import { IPostInput } from '../../../../interfaces/Post';
import { IToken } from '../../../../interfaces/Token';
import checkAbilityToPost from '../../../../middlewares/checkAbilityToPost';
import xpValues from '../../../../utils/xpValues';
import postValidationSchema from '../../../../validators/postSchema';
import { createMediaPost, createTextPost } from './utils/handlePostCreation';

const createNewPost = async (post: IPostInput, user: IToken, pubsub: PubSub) => {
  if (!user.isArtist) {
    throw new AuthenticationError('Somente artistas podem postar');
  }

  const profile = await checkAbilityToPost(user.username);

  const profileDoc = profile._doc;

  if (!profileDoc) {
    throw new UserInputError('Não há perfil');
  }

  const errors = postValidationSchema.validate({
    description: post.description.trim(),
    alt: post.alt,
    title: post.title,
  });

  if (errors.error) {
    throw new UserInputError(errors.error.message);
  }

  const handlePost = async () => {
    if (await post.body) {
      return createMediaPost(post, profileDoc._id);
    }

    return createTextPost(profileDoc._id, post.description);
  };

  const newPost = await handlePost();

  if (!globalThis.__DEV__) {
    await profile.updateOne({ isBlockedToPost: true, postsRemainingToUnblock: 3 });
  }

  await mentionUser({
    avatar: profile._doc?.avatar as string,
    description: post.description,
    from: user.username,
    link: `/post/${newPost._id}`,
    pubsub,
  });

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
