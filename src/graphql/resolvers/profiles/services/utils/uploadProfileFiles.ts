import { IUpload } from '../../../../../interfaces/Upload';
import checkMime from '../../../../../middlewares/checkMime';
import { uploadImage } from '../../../../../utils/upload';

const uploadProfileFiles = async (avatar: Promise<IUpload>, coverImage: Promise<IUpload>) => {
  const getAvatarUrl = async () => {
    const { file: avatarFile } = await avatar;
    const { checkFileFormat: checkAvatarFileFormat } = await checkMime(avatarFile);
    checkAvatarFileFormat('image');
    const avatarImageUrl = await uploadImage(avatarFile.createReadStream, avatarFile?.filename);

    return avatarImageUrl;
  };

  const getCoverImageUrl = async () => {
    const { file: coverFile } = await coverImage;
    const { checkFileFormat: checkCoverFileFormat } = await checkMime(coverFile);
    checkCoverFileFormat('image');
    const coverImageUrl = await uploadImage(coverFile.createReadStream, coverFile?.filename);
    return coverImageUrl;
  };

  return { getAvatarUrl, getCoverImageUrl };
};

export default uploadProfileFiles;
