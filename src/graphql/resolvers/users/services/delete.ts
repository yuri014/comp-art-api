import ArtistProfile from '../../../../entities/ArtistProfile';
import Comments from '../../../../entities/Comments';
import Follower from '../../../../entities/Follower';
import Following from '../../../../entities/Following';
import Notification from '../../../../entities/Notification';
import Post from '../../../../entities/Post';
import SavedPost from '../../../../entities/SavedPost';
import Share from '../../../../entities/Share';
import User from '../../../../entities/User';
import UserProfile from '../../../../entities/UserProfile';
import { IToken } from '../../../../interfaces/Token';
import findProfile from '../../profiles/services/utils/findProfileUtil';
import decrementFollow from './utils/decrementFollow';

const deleteUser = async (user: IToken) => {
  // @ts-ignore
  // eslint-disable-next-line consistent-return
  const deleteUserData = async () => {
    try {
      const userEntity = await User.findById(user.id);

      if (!userEntity) {
        throw new Error('Não existe usuário');
      }

      const profile = await findProfile(user);

      const comments = await Comments.find({
        'comments.author': profile._doc?._id,
      });

      await Promise.all(
        comments.map(async comment => {
          await Post.findByIdAndUpdate(
            comment.post,
            { $inc: { commentsCount: -1 } },
            { useFindAndModify: false },
          );

          return comment.updateOne(
            {
              $pull: {
                comments: {
                  author: profile._doc?._id,
                },
              },
            },
            { useFindAndModify: false },
          );
        }),
      );

      const follower = await Follower.findOne({ username: userEntity.username });

      if (follower) {
        await decrementFollow({
          Entity: UserProfile,
          field: 'following',
          follower: (follower?._doc?.userFollowers as unknown) as string[],
        });

        await decrementFollow({
          Entity: ArtistProfile,
          field: 'following',
          follower: (follower?._doc?.artistFollowers as unknown) as string[],
        });

        await follower.deleteOne();
      }

      const following = await Following.findOne({ username: userEntity.username });

      if (following) {
        await decrementFollow({
          Entity: UserProfile,
          field: 'follower',
          follower: (following?._doc?.userFollowing as unknown) as string[],
        });

        await decrementFollow({
          Entity: ArtistProfile,
          field: 'follower',
          follower: (following?._doc?.artistFollowing as unknown) as string[],
        });
        await following.deleteOne();
      }

      await Notification.deleteOne({ user: userEntity._id });

      await SavedPost.deleteOne({ user: userEntity._id });

      await Post.updateMany(
        { likes: { $elemMatch: { profile: profile._doc?._id } } },
        {
          $pull: {
            likes: {
              profile: profile._doc?._id as string,
            },
          },
          $inc: {
            likesCount: -1,
          },
        },
        { useFindAndModify: false },
      );
      await Share.updateMany(
        { likes: { $elemMatch: { profile: profile._doc?._id } } },
        {
          $pull: {
            likes: {
              profile: profile._doc?._id as string,
            },
          },
          $inc: {
            likesCount: -1,
          },
        },
        { useFindAndModify: false },
      );

      if (userEntity.isArtist) {
        const posts = await Post.find({ artist: profile._doc?._id });

        await Promise.all(
          posts.map(async postItem => {
            await Share.deleteMany({ post: postItem?._doc?.id });
            return Comments.deleteMany({ post: postItem?._doc?._id });
          }),
        );

        await Post.deleteMany({ artist: profile._doc?._id });

        await ArtistProfile.findByIdAndDelete(profile._doc?._id, { useFindAndModify: false });
      } else {
        await UserProfile.findByIdAndDelete(profile._doc?._id, { useFindAndModify: false });
      }

      await Share.deleteMany({ profile: profile._doc?._id });

      await userEntity.deleteOne();

      return true;
    } catch (error) {
      // send email
    }
  };

  await deleteUserData();

  return true;
};

export default deleteUser;
