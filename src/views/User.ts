import User from '../entities/User';

export default class UsersView {
  render({ id, name, username, profile, email }: User) {
    return {
      id,
      name,
      username,
      profile,
      email,
    };
  }
}
