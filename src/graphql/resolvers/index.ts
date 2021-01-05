import { getRepository } from 'typeorm';
import User from '../../entities/User';

const resolvers = {
  Query: {
    getUser: () => getRepository(User).findOne(),
  },
};

export default resolvers;
