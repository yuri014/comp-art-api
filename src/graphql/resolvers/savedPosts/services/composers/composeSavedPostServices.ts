import { UserInputError } from 'apollo-server-express';

import Post from '../../../../../entities/Post';
import SavedPost from '../../../../../entities/SavedPost';
import Share from '../../../../../entities/Share';
import { ISavedPostService } from '../../../../../interfaces/SavedPost';
import { IToken } from '../../../../../interfaces/Token';

const savedPostCompose = async (user: IToken, postID: string) => {
  const share = await Share.findById(postID);
  const post = await Post.findById(postID);

  const savedPost = post || share;

  if (!savedPost) {
    throw new UserInputError('Esse post não existe');
  }

  const isAlreadySave = await SavedPost.findOne({
    user: user.id,
    posts: {
      $elemMatch: {
        post: postID,
      },
    },
  });

  return (callback: ISavedPostService) => callback(user, isAlreadySave, savedPost);
};

export default savedPostCompose;
