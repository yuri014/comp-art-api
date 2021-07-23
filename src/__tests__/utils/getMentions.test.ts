import getMentions from '../../utils/getMentions';

describe('Get user @', () => {
  it('Should not return any user', () => {
    const message = '#user !user us@er *user user@';
    const mention = getMentions(message);

    expect(mention).toBeNull();
  });

  it('Should return @user', () => {
    const message = 'Hello @user';
    const mention = getMentions(message);

    expect(mention).toEqual(['@user']);
  });
});
