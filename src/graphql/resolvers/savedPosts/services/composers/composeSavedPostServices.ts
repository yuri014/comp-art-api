import { UserInputError } from 'apollo-server-express';

import Post from '../../../../../entities/Post';
import SavedPost from '../../../../../entities/SavedPost';
import Share from '../../../../../entities/Share';
import { ISavedPostService } from '../../../../../interfaces/SavedPost';
import { IToken } from '../../../../../interfaces/Token';
import findProfile from '../../../profiles/services/utils/findProfileUtil';

const savedPostCompose = async (user: IToken, postID: string) => {
  const profile = await findProfile(user);

  const profileDoc = profile._doc;

  if (!profileDoc) {
    throw new UserInputError('Não existe perfil');
  }

  const share = await Share.findById(postID);
  const post = await Post.findById(postID);

  const savedPost = post || share;

  if (!savedPost) {
    throw new UserInputError('Esse post não existe');
  }

  const isAlreadySave = await SavedPost.findOne({
    profile: profileDoc._id,
    posts: {
      $elemMatch: {
        post: postID,
      },
    },
  });

  return (callback: ISavedPostService) =>
    callback(isAlreadySave, profileDoc._id, savedPost, user.isArtist);
};

export default savedPostCompose;
