import getImageColor from '../../../../../utils/getImageColor';
import mediaIDs from '../../../../../utils/mediaIDs';

const managePostColors = async (thumbnailUrl: string, bodyUrl: string, mediaId: number) => {
  const darkThemeColor = '#28282C';
  const lightThemeColor = '#ffffff';
  const { audioID } = mediaIDs;

  const getDarkAndLightColor = async (image: string) => {
    const darkColor = await getImageColor(image, darkThemeColor);
    const lightColor = await getImageColor(image, lightThemeColor);

    return { darkColor, lightColor };
  };

  if (thumbnailUrl.length > 0) {
    return getDarkAndLightColor(thumbnailUrl);
  }

  if (thumbnailUrl.length <= 0 && mediaId === audioID) {
    return { darkColor: '#1CC5B7', lightColor: '#01746E' };
  }

  return getDarkAndLightColor(bodyUrl);
};

export default managePostColors;
