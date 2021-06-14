import { UserInputError } from 'apollo-server-express';
import getUser from '../../../../auth/getUser';
import Share from '../../../../entities/Share';
import { IProfileEntity } from '../../../../interfaces/Models';
import { IToken } from '../../../../interfaces/Token';
import { isFollowingLoggedUser } from '../../profiles/services/utils/findFollowersWithAuth';

interface FindWhoSharesPost {
  token: string;
  postID: string;
  offset: number;
}

const findWhoSharesPost = async ({ token, postID, offset }: FindWhoSharesPost) => {
  const shares = await Share.find({ post: postID }).skip(offset).limit(6).populate('profile');

  if (!shares) {
    throw new UserInputError('Não há compartilhamento para esse post');
  }

  const user = getUser(token);

  if (user) {
    const authUser = user as IToken;

    return shares.map(({ profile }) => {
      const profileEntity = profile as IProfileEntity;
      return isFollowingLoggedUser(profileEntity, authUser.username);
    });
  }

  return shares.map(({ profile }) => profile);
};

export default findWhoSharesPost;
