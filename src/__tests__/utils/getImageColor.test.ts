import getImageColor from '../../utils/getImageColor';

describe('Delivers an accessible image color', () => {
  it('Should return default color', async () => {
    const image = 'https://www.comp-art.art/CardSEO.png';
    const colorImage = await getImageColor(image, '#fff');

    expect(colorImage).toBe('#6C63FF');
  });

  it('Should return most vibrant color', async () => {
    const image = 'https://www.comp-art.art/CardSEO.png';
    const colorImage = await getImageColor(image, '#000');

    expect(colorImage).toBe('#4fc275');
  });
});
