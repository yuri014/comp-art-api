import { UserInputError } from 'apollo-server-express';
import getUser from '../../../../../auth/getUser';

import Post from '../../../../../entities/Post';
import { IProfileEntity } from '../../../../../interfaces/Models';
import { IFindPostInteractions } from '../../../../../interfaces/Post';
import { IToken } from '../../../../../interfaces/Token';
import { isFollowingLoggedUser } from '../../../profiles/services/utils/findFollowersWithAuth';

const getPostLikes = async ({ offset, postID, token }: IFindPostInteractions) => {
  const post = await Post.findById(postID)
    .where('likes')
    .slice([offset, offset + 8])
    .populate('likes.profile');

  if (!post) {
    throw new UserInputError('Não há post');
  }

  const user = getUser(token);

  if (user) {
    const authUser = user as IToken;

    return post.likes.map(({ profile }) => {
      const profileEntity = profile as IProfileEntity;
      return isFollowingLoggedUser(profileEntity, authUser.username);
    });
  }

  return post.likes.map(({ profile }) => profile);
};

export default getPostLikes;
