import { Router } from 'express';
import Factory from './factory';

const routes = Router();

const user = Factory.generateUser();

routes.post('/users', user.store);

export default routes;
