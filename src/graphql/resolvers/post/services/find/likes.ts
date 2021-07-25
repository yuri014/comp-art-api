import { UserInputError } from 'apollo-server-express';
import getUser from '../../../../../auth/getUser';

import Post from '../../../../../entities/Post';
import Share from '../../../../../entities/Share';
import { IProfileEntity } from '../../../../../interfaces/Models';
import { IFindPostInteractions } from '../../../../../interfaces/Post';
import { IToken } from '../../../../../interfaces/Token';
import { isFollowingLoggedUser } from '../../../profiles/services/utils/findFollowersWithAuth';

const getPostLikes = async ({ offset, postID, token }: IFindPostInteractions) => {
  const artistPost = await Post.findById(postID)
    .where('likes')
    .slice([offset, offset + 6])
    .populate('likes.profile');

  const share = await Share.findById(postID)
    .where('likes')
    .slice([offset, offset + 6])
    .populate('likes.profile');

  const post = artistPost || share;

  if (!post) {
    throw new UserInputError('Não há post');
  }

  const user = getUser(token);

  if (user) {
    const authUser = user as IToken;
    const profiles = post.likes.map(({ profile }) => {
      const profileEntity = profile as IProfileEntity;
      return isFollowingLoggedUser(profileEntity, authUser.username);
    });

    return profiles;
  }

  return post.likes.map(({ profile }) => profile);
};

export default getPostLikes;
