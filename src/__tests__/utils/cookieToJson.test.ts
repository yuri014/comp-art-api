import cookieToJson from '../../utils/cookieToJson';

describe('Convert cookies to an object', () => {
  it('Should return an empty object', () => {
    const values = ['', 'test'];

    const cookies = values.map(value => cookieToJson(value));

    expect(cookies[0]).toEqual({});
    expect(cookies[1]).toEqual({});
  });

  it('Should return an object from cookies', () => {
    const cookie = 'locale=pt-br; token=eyQJKLWJ';

    const cookieObject = cookieToJson(cookie);

    expect(cookieObject).toEqual({ locale: 'pt-br', token: 'eyQJKLWJ' });
  });
});
