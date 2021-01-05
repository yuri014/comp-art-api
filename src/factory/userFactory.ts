import AuthController from '../controllers/Auth';
import UserController from '../controllers/User';

const generateInstance = () => {
  const user = new UserController();
  const authUser = new AuthController();
  return { user, authUser };
};

export default { generateInstance };
