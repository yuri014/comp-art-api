import tinyColor from 'tinycolor2';

/**
 * Verifica acessibilidade da cor em nível AA
 */
const checkColorAccessibility = (color: string, themeColor: string) => {
  const hasColorAcessibility = tinyColor.isReadable(`${color}`, `${themeColor}`, {
    level: 'AA',
    size: 'large',
  });

  return hasColorAcessibility;
};

export default checkColorAccessibility;
