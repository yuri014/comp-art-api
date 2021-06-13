import express, { Request, Response } from 'express';
import { ApolloServer, PubSub } from 'apollo-server-express';
import { graphqlUploadExpress } from 'graphql-upload';
import { createServer } from 'http';
import cors from 'cors';

import typeDefs from './graphql/definitions';
import resolvers from './graphql/resolvers';
import rateLimiterMiddleware from './middlewares/limiter';
import cookieToJson from './utils/cookieToJson';

require('dotenv').config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
});

const pubsub = new PubSub();

export const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res, connection }) => ({ req, res, connection, pubsub }),
  uploads: false,
  subscriptions: {
    path: '/subscriptions',
    onConnect(_, ws: any) {
      const { headers } = ws.upgradeReq as Request;

      const token = cookieToJson(headers.cookie as string);

      return { req: { headers: { authorization: `Bearer ${token.jwtToken}` } } };
    },
  },
});

const app = express();
app.use(cors({ origin: process.env.FRONT_END_HOST }));
app.use(rateLimiterMiddleware);

app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
  res.send({
    title: 'Comp-Art API',
    version: '0.0.1',
    sponsor: 'https://www.catarse.me/compart_6d8c?ref=project_link',
    website: 'https://comp-art.vercel.app/',
  });
});

app.use(
  graphqlUploadExpress({
    maxFileSize: 8000000,
    maxFiles: 4,
  }),
);
server.applyMiddleware({ app, cors: { origin: process.env.FRONT_END_HOST } });
app.use(express.urlencoded({ extended: true }));

export const PORT = process.env.PORT || 3333;

export const httpServer = createServer(app);
