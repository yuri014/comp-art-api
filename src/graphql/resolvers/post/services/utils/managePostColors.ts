import getImageColor from '@utils/getImageColor';

const managePostColors = async (thumbnailUrl: string, bodyUrl: string) => {
  const darkThemeColor = '#28282C';
  const lightThemeColor = '#ffffff';

  const getDarkAndLightColor = async (color: string) => {
    const darkColor = await getImageColor(`${process.env.HOST}/${color}`, darkThemeColor);
    const lightColor = await getImageColor(`${process.env.HOST}/${color}`, lightThemeColor);

    return { darkColor, lightColor };
  };

  if (thumbnailUrl.length > 0) {
    return getDarkAndLightColor(thumbnailUrl);
  }

  return getDarkAndLightColor(bodyUrl);
};

export default managePostColors;
