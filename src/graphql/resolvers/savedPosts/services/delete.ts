import { UserInputError } from 'apollo-server-express';

import SavedPost from '../../../../entities/SavedPost';
import { ISavedPostService } from '../../../../interfaces/SavedPost';

const deleteSavedPostService: ISavedPostService = async (isAlreadySave, profileID, savedPost) => {
  if (!isAlreadySave) {
    throw new UserInputError('Post não está nas sua lista de salvos');
  }

  await SavedPost.findOneAndUpdate(
    {
      profile: profileID,
    },
    {
      $pull: {
        posts: {
          post: savedPost?._id,
        },
      },
    },
  );

  return true;
};

export default deleteSavedPostService;
