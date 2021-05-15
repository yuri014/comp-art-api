import { UserInputError } from 'apollo-server-express';
import path from 'path';
import getImageSize from 'image-size';

const handleImageDimension = (uploadPath: string) => {
  const realPath = path.join(__dirname, '..', '..', '..', '..', '..', '..', `/public${uploadPath}`);
  const dimensions = getImageSize(realPath);

  const imageHeight = dimensions.height;

  if (!imageHeight) {
    throw new UserInputError('Arquivo precisa ser uma image.');
  }

  if (imageHeight > 768) {
    return '768px';
  }

  return `${imageHeight}px`;
};

export default handleImageDimension;
