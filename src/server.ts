import express from 'express';
import debug from 'debug';
import { ApolloServer, gql } from 'apollo-server-express';
import mongoose from 'mongoose';

require('dotenv').config();

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });
app.use(express.urlencoded({ extended: true }));
const PORT = 3333;

mongoose
  .connect(process.env.CLUSTER_URL as string, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => debug.log(`Server running at: ${PORT}`)));
