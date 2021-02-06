import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { IResolvers } from 'graphql-tools';

import Following from '../../../entities/Following';
import Post from '../../../entities/Post';
import ArtistProfile from '../../../entities/ArtistProfile';
import { FollowProfile } from '../../../interfaces/Follow';
import { IPostInput } from '../../../interfaces/Post';
import checkAbilityToPost from '../../../middlewares/checkAbilityToPost';
import checkAuth from '../../../middlewares/checkAuth';
import { uploadAudio, uploadImage } from '../../../utils/upload';
import postValidationSchema from '../../../validators/postSchema';

const postResolvers: IResolvers = {
  Query: {
    async getPosts(parent, { offset }: { offset: number }, context) {
      const user = checkAuth(context);

      const following = await Following.find({ username: user.username });

      if (following.length === 0) {
        throw new UserInputError('Não está seguindo nenhum usuário');
      }

      const [artists] = following.map(
        profile => (profile.artistFollowing as unknown) as FollowProfile[],
      );

      if (artists.length === 0) {
        throw new UserInputError('Não está seguindo nenhum artista');
      }

      const posts = await Post.find({
        artist: {
          $in: artists.map(artist => ({ name: artist.name, username: artist.owner })),
        },
      })
        .skip(offset)
        .limit(3)
        .sort({ createdAt: -1 });

      return posts;
    },
    async getProfilePosts(_, { offset, username }: { offset: number; username: string }) {
      const profile = await ArtistProfile.findOne({ owner: username });

      if (profile) {
        const posts = await Post.find({
          artist: {
            name: profile.name,
            username,
          },
        })
          .skip(offset)
          .limit(3)
          .sort({ createdAt: -1 });

        return posts;
      }
      return [];
    },
  },
  Mutation: {
    async createPost(_, { postInput }: { postInput: IPostInput }, context) {
      const user = checkAuth(context);

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
      });

      // await profile.updateOne({ isBlockedToPost: true, postsRemainingToUnblock: 3 });

      await newPost.save();

      await profile.updateOne({ $inc: { postCount: 1 } });

      return true;
    },
  },
};

export default postResolvers;
