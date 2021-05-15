import { IUpload } from '../interfaces/Upload';
import checkMime from '../middlewares/checkMime';
import { uploadAudio, uploadImage } from './upload';

export const uploadBody = async (fileBody: Promise<IUpload>) => {
  const { file } = await fileBody;
  const audioId = 2;

  const { stream, fileFormat } = await checkMime(file);

  const mediaId = fileFormat === 'image' ? 1 : 2;

  if (mediaId === audioId) {
    const body = await uploadAudio(stream, file.filename);

    return { body, mediaId };
  }

  const body = await uploadImage(stream, file.filename);

  return { body, mediaId };
};

export const uploadThumbnail = async (thumbnail: Promise<IUpload> | undefined) => {
  if (thumbnail) {
    const { file: thumbnailFile } = await thumbnail;

    const { stream, checkFileFormat } = await checkMime(thumbnailFile);

    checkFileFormat('image');

    return uploadImage(stream, thumbnailFile.filename);
  }

  return '';
};
