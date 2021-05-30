import { UserInputError } from 'apollo-server-express';

import SavedPost from '../../../../entities/SavedPost';
import { ISavedPostService } from '../../../../interfaces/SavedPost';

const deleteSavedPostService: ISavedPostService = async (user, isAlreadySave, savedPost) => {
  if (!isAlreadySave) {
    throw new UserInputError('Post não está nas sua lista de salvos');
  }

  await SavedPost.findOneAndUpdate(
    {
      user: user.id,
    },
    {
      $pull: {
        posts: {
          post: savedPost?._id,
        },
      },
    },
    {
      useFindAndModify: false,
    },
  );

  return true;
};

export default deleteSavedPostService;
