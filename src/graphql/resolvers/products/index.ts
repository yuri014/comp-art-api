import { IResolvers } from 'apollo-server-express';

import { IProductInput } from '@interfaces/Product';
import checkAuth from '@middlewares/checkAuth';
import createProductService from './services/create';

const productsResolvers: IResolvers = {
  Query: {},
  Mutation: {
    async createProduct(_, { productInput }: { productInput: IProductInput }, context) {
      const user = checkAuth(context);

      return createProductService(user, productInput);
    },
  },
};

export default productsResolvers;
