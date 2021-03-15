import { AuthenticationError, UserInputError } from 'apollo-server-express';

import Product from '../../../../entities/Product';
import { IToken } from '../../../../interfaces/Token';
import { IProductInput } from '../../../../interfaces/Product';
import { uploadImage } from '../../../../utils/upload';
import productValidationSchema from '../../../../validators/productSchema';

const createProductService = async (user: IToken, productInput: IProductInput) => {
  if (!user.isArtist) {
    throw new AuthenticationError('Somente artistas podem criar produtos.');
  }

  const errors = productValidationSchema.validate(productInput);

  if (errors.error) {
    throw new UserInputError('Erros', {
      errors: errors.error.message,
    });
  }

  const { category, images, name, phone, price, description } = productInput;

  const uploadedImages = await images;

  const imagesUrl = await Promise.all(
    uploadedImages.map(({ file }) => uploadImage(file.createReadStream, file.filename)),
  );

  const newProduct = new Product({
    name: name.trim(),
    artist: user.username,
    category: category.trim(),
    phone: phone.trim(),
    price,
    description: description?.trim(),
    images: imagesUrl,
  });

  await newProduct.save();

  return true;
};

export default createProductService;