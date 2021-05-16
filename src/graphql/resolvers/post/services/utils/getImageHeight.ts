import { IPost } from '../../../../../interfaces/Post';
import mediaIDs from '../../../../../utils/mediaIDs';
import handleImageDimension from './handleImageDimension';

const getImageHeight = (post: IPost) => {
  const { imageID } = mediaIDs;

  if (post.mediaId === imageID) {
    return handleImageDimension(post.body as string);
  }

  return '';
};

export default getImageHeight;
