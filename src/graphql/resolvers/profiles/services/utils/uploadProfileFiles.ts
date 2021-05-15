import { IUpload } from '../../../../../interfaces/Upload';
import checkMime from '../../../../../middlewares/checkMime';
import { uploadImage } from '../../../../../utils/upload';

const uploadProfileFiles = async (avatar: Promise<IUpload>, coverImage: Promise<IUpload>) => {
  const { file: avatarFile } = await avatar;
  const { checkFileFormat: checkAvatarFileFormat } = await checkMime(avatarFile);
  checkAvatarFileFormat('image');

  const { file: coverFile } = await coverImage;
  const { checkFileFormat: checkCoverFileFormat } = await checkMime(coverFile);
  checkCoverFileFormat('image');

  const avatarImageUrl = await uploadImage(avatarFile.createReadStream, avatarFile?.filename);
  const coverImageUrl = await uploadImage(coverFile.createReadStream, coverFile?.filename);

  return { avatarImageUrl, coverImageUrl };
};

export default uploadProfileFiles;
