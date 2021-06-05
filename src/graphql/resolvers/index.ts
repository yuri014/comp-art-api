import { IArtistProfile } from '../../interfaces/Profile';
import { IProfileEntity } from '../../interfaces/Models';
import commentsResolvers from './comments';
import postResolvers from './post';
import profileResolvers from './profiles';
import usersResolvers from './users';
import shareResolvers from './share';
import productsResolvers from './products';
import savedPostsResolvers from './savedPosts';
import notificationsResolvers from './notifications';

const postsMutations = {
  ...postResolvers.Mutation,
  ...commentsResolvers.Mutation,
  ...shareResolvers.Mutation,
  ...savedPostsResolvers.Mutation,
};

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
    ...shareResolvers.Query,
    ...notificationsResolvers.Query,
    ...savedPostsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...profileResolvers.Mutation,
    ...productsResolvers.Mutation,
    ...notificationsResolvers.Mutation,
    ...postsMutations,
  },
  Subscription: {
    ...notificationsResolvers.Subscription,
  },
};

export default resolvers;
