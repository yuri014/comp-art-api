import getImageColor from '../../../../../utils/getImageColor';

const managePostColors = async (thumbnailUrl: string, bodyUrl: string) => {
  const darkThemeColor = '#28282C';
  const lightThemeColor = '#ffffff';

  const getDarkAndLightColor = async (image: string) => {
    const darkColor = await getImageColor(image, darkThemeColor);
    const lightColor = await getImageColor(image, lightThemeColor);

    return { darkColor, lightColor };
  };

  if (thumbnailUrl.length > 0) {
    return getDarkAndLightColor(thumbnailUrl);
  }

  return getDarkAndLightColor(bodyUrl);
};

export default managePostColors;
