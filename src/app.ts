import express, { Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { graphqlUploadExpress } from 'graphql-upload';

import typeDefs from './graphql/definitions';
import resolvers from './graphql/resolvers';
import rateLimiterMiddleware from './middlewares/limiter';

require('dotenv').config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
  uploads: false,
});

const app = express();
app.use(rateLimiterMiddleware);

app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
  res.send({
    title: 'CompArt API',
    version: '0.0.1',
    sponsor: 'https://www.catarse.me/compart_6d8c?ref=project_link',
    website: 'https://comp-art.vercel.app/',
  });
});

app.use(
  graphqlUploadExpress({
    maxFileSize: 8000000,
    maxFiles: 2,
  }),
);
server.applyMiddleware({ app, cors: { origin: process.env.FRONT_END_HOST } });
app.use(express.urlencoded({ extended: true }));

export const PORT = process.env.PORT || 3333;

export default app;
