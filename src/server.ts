import debug from 'debug';
import express from 'express';
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
import { graphqlUploadExpress } from 'graphql-upload';

import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import rateLimiterMiddleware from './middlewares/limiter';

require('dotenv').config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
  uploads: false,
});

const app = express();
app.use(express.static('public'));
app.use(
  graphqlUploadExpress({
    maxFileSize: 3000000,
    maxFiles: 1,
  }),
);
server.applyMiddleware({ app, cors: { origin: process.env.FRONT_END_HOST } });
app.use(express.urlencoded({ extended: true }));
const PORT = 3333;

app.use(rateLimiterMiddleware);
mongoose
  .connect(process.env.CLUSTER_URL as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => app.listen(PORT, () => debug.log(`Server running at: ${PORT}`)));
