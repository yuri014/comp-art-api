import { IUpload } from '@interfaces/Upload';
import { uploadAudio, uploadImage } from './upload';

export const uploadBody = async (fileBody: Promise<IUpload>, mediaId: number) => {
  const { file } = await fileBody;
  const audioId = 2;

  if (mediaId === audioId) {
    return uploadAudio(file.createReadStream, file.filename);
  }

  return uploadImage(file.createReadStream, file.filename);
};

export const uploadThumbnail = async (thumbnail: Promise<IUpload> | undefined) => {
  if (thumbnail) {
    const { file: thumbnailFile } = await thumbnail;
    return uploadImage(thumbnailFile.createReadStream, thumbnailFile.filename);
  }

  return '';
};
