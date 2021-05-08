import { UserInputError } from 'apollo-server-express';
import Post from '../../../../entities/Post';
import SavedPost from '../../../../entities/SavedPost';
import Share from '../../../../entities/Share';

import { IToken } from '../../../../interfaces/Token';
import findProfile from '../../profiles/services/utils/findProfileUtil';

const createSavedPost = async (user: IToken, postID: string) => {
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

  if (isAlreadySave) {
    throw new UserInputError('Post já está nas sua lista de salvos');
  }

  // @ts-ignore
  const isPost = savedPost.owner as string | undefined;

  await SavedPost.findOneAndUpdate(
    { profile: profileDoc._id, onModel: user.isArtist ? 'ArtistProfile' : 'UserProfile' },
    {
      profile: profileDoc._id,
      onModel: user.isArtist ? 'ArtistProfile' : 'UserProfile',
      $push: {
        posts: {
          $position: 0,
          $each: [
            {
              post: savedPost?._id,
              onModel: isPost ? 'Post' : 'Share',
            },
          ],
        },
      },
    },
    {
      upsert: true,
      useFindAndModify: false,
    },
  );

  return true;
};

export default createSavedPost;
