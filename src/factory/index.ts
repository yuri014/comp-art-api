import UserController from '../controllers/User';

const generateUser = () => {
  const user = new UserController();
  return user;
};

export default { generateUser };
