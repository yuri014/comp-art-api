import debug from 'debug';
import express from 'express';
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
import { graphqlUploadExpress } from 'graphql-upload';

import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

require('dotenv').config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
  uploads: false,
});

const app = express();
app.use(graphqlUploadExpress());
server.applyMiddleware({ app, cors: { origin: process.env.FRONT_END_HOST } });
app.use(express.urlencoded({ extended: true }));
const PORT = 3333;

mongoose
  .connect(process.env.CLUSTER_URL as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => app.listen(PORT, () => debug.log(`Server running at: ${PORT}`)));
