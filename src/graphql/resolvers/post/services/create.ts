import { AuthenticationError, UserInputError } from 'apollo-server-express';
import Post from '../../../../entities/Post';
import { IPostInput } from '../../../../interfaces/Post';
import { IToken } from '../../../../interfaces/Token';
import checkAbilityToPost from '../../../../middlewares/checkAbilityToPost';
import levelUp from '../../../../utils/levelUp';
import { uploadAudio, uploadImage } from '../../../../utils/upload';
import postValidationSchema from '../../../../validators/postSchema';

const createNewPost = async (postInput: IPostInput, user: IToken) => {
  if (!user.isArtist) {
    throw new AuthenticationError('Somente artistas podem postar');
  }

  const profile = await checkAbilityToPost(user.username);

  const post = {
    description: postInput.description.trim(),
    body: postInput.body,
    isAudio: postInput.isAudio,
  };

  const errors = postValidationSchema.validate({
    description: post.description,
  });

  if (errors.error) {
    throw new UserInputError('Erros', {
      errors: errors.error.message,
    });
  }

  const { file } = await post.body;

  const media = async () => {
    if (post.isAudio) {
      return uploadAudio(file.createReadStream, file.filename);
    }

    return uploadImage(file.createReadStream, file.filename);
  };

  const fileUrl = await media();

  const newPost = new Post({
    description: post.description,
    body: fileUrl,
    createdAt: new Date().toISOString(),
    artist: {
      name: profile.name,
      username: profile.owner,
    },
    isAudio: post.isAudio,
    avatar: profile.avatar,
  });

  // await profile.updateOne({ isBlockedToPost: true, postsRemainingToUnblock: 3 });

  await newPost.save();

  const updatedProfile = await profile.updateOne(
    { $inc: { postCount: 1, xp: 250 } },
    { new: true },
  );

  return levelUp(updatedProfile);
};

export default createNewPost;
