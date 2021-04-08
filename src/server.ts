import debug from 'debug';
import express from 'express';
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
import { graphqlUploadExpress } from 'graphql-upload';

import typeDefs from './graphql/definitions';
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
app.use(rateLimiterMiddleware);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send({
    title: 'CompArt API',
    version: '0.0.1',
    sponsor: 'https://www.catarse.me/compart_6d8c?ref=project_link',
    website: 'https://comp-art.vercel.app/',
  });
});

app.use(
  graphqlUploadExpress({
    maxFileSize: 3000000,
    maxFiles: 2,
  }),
);
server.applyMiddleware({ app, cors: { origin: process.env.FRONT_END_HOST } });
app.use(express.urlencoded({ extended: true }));
const PORT = 3333;

mongoose
  .connect(process.env.CLUSTER_URL as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => app.listen(process.env.PORT || PORT, () => debug.log(`Server running at: ${PORT}`)));
