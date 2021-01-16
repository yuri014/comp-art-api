import postsResolvers from './posts';
import profileResolvers from './profiles';
import usersResolvers from './users';

const resolvers = {
  Query: {
    ...profileResolvers.Query,
    ...postsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...profileResolvers.Mutation,
  },
};

export default resolvers;
