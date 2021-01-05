import { Router } from 'express';

import UserFactory from './factory/userFactory';
import authMiddleware from './middlewares/Auth';

const routes = Router();

const { user, authUser } = UserFactory.generateInstance();

routes.post('/users', user.store);
routes.post('/auth', authUser.authenticate);

routes.get('/users', authMiddleware, user.index);

export default routes;
