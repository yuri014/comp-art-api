import tinyColor from 'tinycolor2';
import Vibrant from 'node-vibrant';

/**
 * Verifica acessibilidade da cor
 * @returns cor Predominante ou cor secundária
 */
const getVibrant = async (path: string, themeColor: string) => {
  const palette = await Vibrant.from(path).getPalette();

  const color = palette.Vibrant?.hex;

  if (!tinyColor(themeColor).isValid() || !themeColor) {
    throw new Error(
      `Color ${themeColor} is invalid and required, please try again with a color valid format...`,
    );
  }

  const hasColorAcessibility = tinyColor.isReadable(`${color}`, `${themeColor}`, {
    level: 'AA',
    size: 'large',
  });

  if (!hasColorAcessibility) {
    return palette.LightVibrant?.hex;
  }

  return color;
};

export default getVibrant;
