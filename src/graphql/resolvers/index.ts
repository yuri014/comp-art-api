import commentsResolvers from './comments';
import postResolvers from './post';
import profileResolvers from './profiles';
import usersResolvers from './users';
import shareResolvers from './share';
import productsResolvers from './products';
import { IArtistProfile } from '../../interfaces/Profile';
import { IProfileEntity } from '../../interfaces/Models';

const resolvers = {
  Timeline: {
    __resolveType(obj: { artist: IArtistProfile; profile: IProfileEntity }) {
      if (obj.artist) {
        return 'Post';
      }
      if (obj.profile) {
        return 'Share';
      }
      return null; // GraphQLError is thrown
    },
  },
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
