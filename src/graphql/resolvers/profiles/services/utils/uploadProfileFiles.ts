import { IUpload } from '../../../../../interfaces/Upload';
import checkMime from '../../../../../middlewares/checkMime';
import { uploadImage } from '../../../../../utils/upload';

const uploadProfileFiles = async (avatar: Promise<IUpload>, coverImage: Promise<IUpload>) => {
  const { file: avatarFile } = await avatar;
  const { stream: avatarStream, checkFileFormat: checkAvatarFileFormat } = await checkMime(
    avatarFile,
  );
  checkAvatarFileFormat('image');

  const { file: coverFile } = await coverImage;
  const { stream: coverStream, checkFileFormat: checkCoverFileFormat } = await checkMime(coverFile);
  checkCoverFileFormat('image');

  const avatarImageUrl = await uploadImage(avatarStream, avatarFile?.filename);
  const coverImageUrl = await uploadImage(coverStream, coverFile?.filename);

  return { avatarImageUrl, coverImageUrl };
};

export default uploadProfileFiles;
