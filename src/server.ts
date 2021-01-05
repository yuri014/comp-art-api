import express from 'express';
import 'reflect-metadata';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import debug from 'debug';

import resolvers from './graphql/resolvers';
import typeDefs from './graphql/typeDefs';
import './database/connection';

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
const PORT = 3333;

app.use(cors());
server.applyMiddleware({ app });

app.listen(PORT, () => debug.log(`Server running at: ${PORT}`));
