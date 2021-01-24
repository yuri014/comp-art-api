import { AuthenticationError } from 'apollo-server-express';
import { IResolvers } from 'graphql-tools';
import Post from '../../../entities/Post';

import { IPostInput } from '../../../interfaces/Post';
import checkAbilityToPost from '../../../middlewares/checkAbilityToPost';
import checkAuth from '../../../middlewares/checkAuth';
import uploadImage from '../../../utils/uploadImage';

const postResolvers: IResolvers = {
  Mutation: {
    async createPost(_, { postInput }: { postInput: IPostInput }, context) {
      const user = checkAuth(context);

      if (!user.isArtist) {
        throw new AuthenticationError('Somente artistas podem postar');
      }

      const profile = await checkAbilityToPost(user.username);

      const post = { description: postInput.description.trim(), body: postInput.body };

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
