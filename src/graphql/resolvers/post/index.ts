import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { IResolvers } from 'graphql-tools';

import Following from '../../../entities/Following';
import Post from '../../../entities/Post';
import { IPostInput } from '../../../interfaces/Post';
import checkAbilityToPost from '../../../middlewares/checkAbilityToPost';
import checkAuth from '../../../middlewares/checkAuth';
import uploadImage from '../../../utils/uploadImage';
import postValidationSchema from '../../../validators/postSchema';

const postResolvers: IResolvers = {
  Query: {
    async getPosts(parent, args, context) {
      const user = checkAuth(context);

      const following = await Following.find({ username: user.username });

      if (!following) {
        throw new UserInputError('Não está seguindo nenhum usuário');
      }

      const [artists] = following.map(profile => profile.artistFollowing);

      if (!artists) {
        throw new UserInputError('Não está seguindo nenhum artista');
      }

      const posts = await Post.find({
        artist: {
          $in: artists.map(artist => artist.owner),
        },
      });

      return posts;
    },
  },
  Mutation: {
    async createPost(_, { postInput }: { postInput: IPostInput }, context) {
      const user = checkAuth(context);

      if (!user.isArtist) {
        throw new AuthenticationError('Somente artistas podem postar');
      }

      const profile = await checkAbilityToPost(user.username);

      const post = { description: postInput.description.trim(), body: postInput.body };

      const errors = postValidationSchema.validate({
        description: post.description,
      });

      if (errors.error) {
        throw new UserInputError('Erros', {
          errors: errors.error.message,
        });
      }

      const { file } = await post.body;

      const imageUrl = await uploadImage(file.createReadStream, file.filename);

      const newProfile = new Post({
        description: post.description,
        body: imageUrl,
        createdAt: new Date().toISOString(),
        artist: profile.owner,
      });

      await profile.updateOne({ isBlockedToPost: true, postsRemainingToUnblock: 3 });

      await newProfile.save();

      return true;
    },
  },
};

export default postResolvers;
