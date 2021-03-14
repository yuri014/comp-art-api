import { AuthenticationError, IResolvers, UserInputError } from 'apollo-server-express';

import { uploadImage } from '../../../utils/upload';
import { IProductInput } from '../../../interfaces/Product';
import checkAuth from '../../../middlewares/checkAuth';
import postValidationSchema from '../../../validators/postSchema';
import Product from '../../../entities/Product';

const productsResolvers: IResolvers = {
  Query: {},
  Mutation: {
    async createProduct(_, { productInput }: { productInput: IProductInput }, context) {
      const user = checkAuth(context);

      if (!user.isArtist) {
        throw new AuthenticationError('Somente artistas podem criar produtos.');
      }

      const errors = postValidationSchema.validate(productInput);

      if (errors.error) {
        throw new UserInputError('Erros', {
          errors: errors.error.message,
        });
      }

      const { category, images, name, phone, value, description } = productInput;

      const uploadedImages = await images;

      const imagesUrl = await Promise.all(
        uploadedImages.map(({ file }) => uploadImage(file.createReadStream, file.filename)),
      );

      const newProduct = new Product({
        name: name.trim(),
        artist: user.username,
        category: category.trim(),
        phone: phone.trim(),
        value,
        description: description?.trim(),
        images: imagesUrl,
      });

      await newProduct.save();

      return true;
    },
  },
};

export default productsResolvers;
