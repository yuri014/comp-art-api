import mongoose from 'mongoose';
import { UserInputError } from 'apollo-server-express';

import database from '../../../../../__mocks__/database';
import { createTextPost } from '../../../../../graphql/resolvers/post/services/utils/handlePostCreation';
import Post from '../../../../../entities/Post';

const db = database();

describe('Handle save text post', () => {
  beforeAll(async () => {
    await db.connectDB();
  });

  afterEach(async () => {
    await db.clearDB();
  });

  afterAll(async () => {
    await db.closeDB();
  });

  const createAndFindPost = async (description: string) => {
    const profileID = mongoose.Types.ObjectId();
    const newPost = await createTextPost(profileID, description);

    const post = await Post.findById(newPost._id);

    return post;
  };

  it('Should save a text post', async () => {
    const post = await createAndFindPost(' Test ');

    expect(post?.description).toBe('Test');
  });

  it('Should throw an error when text is empty', async () => {
    await expect(createAndFindPost('')).rejects.toThrowError(UserInputError);
  });
});
