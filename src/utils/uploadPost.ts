import { FileUpload } from 'graphql-upload';
import { IUpload } from '../interfaces/Upload';
import checkMimeType from '../middlewares/checkMimeType';
import { uploadAudio, uploadImage } from './upload';

const createStream = (file: FileUpload) => {
  if (!file.createReadStream) {
    throw new Error();
  }

  const stream = file.createReadStream();

  return stream;
};

export const uploadBody = async (fileBody: Promise<IUpload>) => {
  const { file } = await fileBody;
  const audioId = 2;

  const stream = createStream(file as FileUpload);
  const mimeType = await checkMimeType(stream);

  const checkMimes = mimeType.split('/')[0];
  const mediaId = checkMimes === 'image' ? 1 : 2;

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

    const stream = createStream(thumbnailFile as FileUpload);
    return uploadImage(stream, thumbnailFile.filename);
  }

  return '';
};
