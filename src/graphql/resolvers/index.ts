import postResolvers from './post';
import profileResolvers from './profiles';
import usersResolvers from './users';

const resolvers = {
  Query: {
    ...profileResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...profileResolvers.Mutation,
    ...postResolvers.Mutation,
  },
};

export default resolvers;
