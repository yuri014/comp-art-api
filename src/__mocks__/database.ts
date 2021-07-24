import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const database = () => {
  let mongoDB: MongoMemoryServer;

  const connectDB = async () => {
    mongoDB = await MongoMemoryServer.create();
    const uri = mongoDB.getUri();

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  };

  const closeDB = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoDB.stop();
  };

  const clearDB = async () => {
    const { collections } = mongoose.connection;

    await Promise.all(
      Object.keys(collections).map(async key => {
        const collection = collections[key.toString()];

        // @ts-ignore
        await collection.deleteMany();
      }),
    );
  };

  return { connectDB, clearDB, closeDB };
};

export default database;
