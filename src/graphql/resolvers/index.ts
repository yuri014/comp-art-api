import commentsResolvers from './comments';
import postResolvers from './post';
import profileResolvers from './profiles';
import usersResolvers from './users';
import shareResolvers from './share';
import productsResolvers from './products';

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
    ...productsResolvers.Mutation,
  },
};

export default resolvers;
