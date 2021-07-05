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
        comments.map(async comment =>
          comment.updateOne(
            {
              $pull: {
                comments: {
                  author: profile._doc?._id,
                },
              },
            },
            { useFindAndModify: false },
          ),
        ),
      );

      const follower = await Follower.findOne({ username: userEntity.username });

      await decrementFollow({
        Entity: UserProfile,
        field: 'following',
        follower: (follower?.userFollowers as unknown) as string[],
      });

      await decrementFollow({
        Entity: ArtistProfile,
        field: 'following',
        follower: (follower?.artistFollowers as unknown) as string[],
      });

      const following = await Following.findOne({ username: userEntity.username });

      await decrementFollow({
        Entity: UserProfile,
        field: 'follower',
        follower: (following?.userFollowing as unknown) as string[],
      });

      await decrementFollow({
        Entity: ArtistProfile,
        field: 'follower',
        follower: (following?.artistFollowing as unknown) as string[],
      });

      await Notification.deleteOne({ user: userEntity._id });

      if (userEntity.isArtist) {
        await Post.deleteMany({ artist: profile._id });
      }

      await Share.deleteMany({ profile: profile._id });

      await SavedPost.deleteOne({ user: userEntity._id });

      await Post.updateMany(
        {
          $pull: {
            likes: {
              profile: profile._id as string,
            },
          },
          $inc: {
            likesCount: -1,
          },
        },
        { useFindAndModify: false },
      );

      await Share.updateMany(
        {
          $pull: {
            likes: {
              profile: profile._id as string,
            },
          },
          $inc: {
            likesCount: -1,
          },
        },
        { useFindAndModify: false },
      );

      await userEntity.deleteOne();

      return true;
    } catch (error) {
      // send email
    }
  };

  deleteUserData();

  return true;
};

export default deleteUser;
