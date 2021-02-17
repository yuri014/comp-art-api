import commentsResolvers from './comments';
import postResolvers from './post';
import profileResolvers from './profiles';
import usersResolvers from './users';

const resolvers = {
  Query: {
    ...profileResolvers.Query,
    ...postResolvers.Query,
    ...commentsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...profileResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },
};

export default resolvers;
