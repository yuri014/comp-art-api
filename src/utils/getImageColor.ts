import tinyColor from 'tinycolor2';
import Vibrant from 'node-vibrant';
import checkColorAccessibility from '../middlewares/checkColorAccessibility';

/**
 * @returns cor Predominante ou cor secundária
 */
const getImageColor = async (path: string, themeColor: string) => {
  const palette = await Vibrant.from(path).getPalette();

  const color = palette.Vibrant?.hex;

  if (!tinyColor(themeColor).isValid() || !color) {
    throw new Error(
      `Cor ${themeColor} é inválida e obrigatória, tente uma cor em um formato diferente...`,
    );
  }

  const hasColorAcessibility = checkColorAccessibility(color, themeColor);

  if (!hasColorAcessibility) {
    const newColor = palette.LightVibrant?.hex;

    const newColorAcessibility = checkColorAccessibility(`${newColor}`, themeColor);

    return newColorAcessibility ? newColor : '#6C63FF';
  }

  return color;
};

export default getImageColor;
