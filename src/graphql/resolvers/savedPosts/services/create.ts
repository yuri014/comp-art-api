import { UserInputError } from 'apollo-server-express';

import SavedPost from '../../../../entities/SavedPost';
import { ISavedPostService } from '../../../../interfaces/SavedPost';

const createSavedPost: ISavedPostService = async (
  isAlreadySave,
  profileID,
  savedPost,
  isArtist,
) => {
  if (isAlreadySave) {
    throw new UserInputError('Post já está nas sua lista de salvos');
  }

  // @ts-ignore
  const isPost = savedPost.owner as string | undefined;

  await SavedPost.findOneAndUpdate(
    { profile: profileID, onModel: isArtist ? 'ArtistProfile' : 'UserProfile' },
    {
      profile: profileID,
      onModel: isArtist ? 'ArtistProfile' : 'UserProfile',
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
