import { IUpload } from '../interfaces/Upload';
import checkMime from '../middlewares/checkMime';
import { uploadAudio, uploadImage } from './upload';

export const uploadBody = async (fileBody: Promise<IUpload>) => {
  const imageId = 1;
  const audioId = 2;

  const { file } = await fileBody;
  const { fileFormat } = await checkMime(file);

  const mediaId = fileFormat === 'image' ? imageId : audioId;

  if (mediaId === audioId) {
    const body = await uploadAudio(file.createReadStream, file.filename);

    return { body, mediaId };
  }

  const body = await uploadImage(file.createReadStream, file.filename);

  return { body, mediaId };
};

export const uploadThumbnail = async (thumbnail: Promise<IUpload> | undefined) => {
  if (thumbnail) {
    const { file: thumbnailFile } = await thumbnail;

    const { checkFileFormat } = await checkMime(thumbnailFile);

    checkFileFormat('image');

    return uploadImage(thumbnailFile.createReadStream, thumbnailFile.filename);
  }

  return '';
};
