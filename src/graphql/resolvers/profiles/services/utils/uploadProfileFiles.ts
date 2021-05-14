import { IUpload } from '../../../../../interfaces/Upload';
import checkMimeType from '../../../../../middlewares/checkMimeType';
import createStream from '../../../../../utils/createStream';
import { uploadImage } from '../../../../../utils/upload';

const uploadProfileFiles = async (avatar: Promise<IUpload>, coverImage: Promise<IUpload>) => {
  const { file: avatarFile } = await avatar;
  const avatarStream = createStream(avatarFile);
  await checkMimeType(avatarStream);

  const { file: coverFile } = await coverImage;
  const coverStream = createStream(coverFile);
  await checkMimeType(coverStream);

  const avatarImageUrl = await uploadImage(avatarStream, avatarFile?.filename);
  const coverImageUrl = await uploadImage(coverStream, coverFile?.filename);

  return { avatarImageUrl, coverImageUrl };
};

export default uploadProfileFiles;
