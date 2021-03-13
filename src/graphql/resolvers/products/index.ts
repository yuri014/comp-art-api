import { AuthenticationError, IResolvers } from 'apollo-server-express';
import { IProductInput } from '../../../interfaces/Product';
import checkAuth from '../../../middlewares/checkAuth';
import postValidationSchema from '../../../validators/postSchema';

const productsResolvers: IResolvers = {
  Query: {},
  Mutation: {
    async createProduct(_, { productInput }: { productInput: IProductInput }, context) {
      const user = checkAuth(context);

      if (!user.isArtist) {
        throw new AuthenticationError('Somente artistas podem criar produtos.');
      }

      postValidationSchema.validate(productInput);
    },
  },
};

export default productsResolvers;
