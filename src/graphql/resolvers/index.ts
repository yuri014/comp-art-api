import commentsResolvers from './comments';
import postResolvers from './post';
import profileResolvers from './profiles';
import usersResolvers from './users';
import shareResolvers from './share';

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
    ...shareResolvers.Mutation,
  },
};

export default resolvers;
