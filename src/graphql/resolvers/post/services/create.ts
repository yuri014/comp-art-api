import { AuthenticationError, UserInputError } from 'apollo-server-express';

import ArtistProfile from '../../../../entities/ArtistProfile';
import Post from '../../../../entities/Post';
import levelUp from '../../../../functions/levelUp';
import { IPostInput } from '../../../../interfaces/Post';
import { IToken } from '../../../../interfaces/Token';
import checkAbilityToPost from '../../../../middlewares/checkAbilityToPost';
import { uploadBody, uploadThumbnail } from '../../../../utils/uploadPost';
import xpValues from '../../../../utils/xpValues';
import postValidationSchema from '../../../../validators/postSchema';
import managePostColors from './utils/managePostColors';

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
  });

  if (errors.error) {
    throw new UserInputError(errors.error.message);
  }

  const body = post.body ? await uploadBody(post.body, post.mediaId) : '';
  const thumbnailUrl = await uploadThumbnail(post.thumbnail);

  const { darkColor, lightColor } = await managePostColors(thumbnailUrl, body);

  const newPost = new Post({
    description: post.description?.trim(),
    body,
    createdAt: new Date().toISOString(),
    mediaId: post.mediaId,
    artist: profileDoc._id,
    alt: post.alt,
    thumbnail: thumbnailUrl,
    darkColor,
    lightColor,
  });

  // await profile.updateOne({ isBlockedToPost: true, postsRemainingToUnblock: 3 });

  await newPost.save();

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
