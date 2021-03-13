import { gql } from 'apollo-server-express';

export const productDefinition = gql`
  type Product {
    artist: Profile!
    name: String!
    description: String!
    value: Int!
    category: String!
    image: [String]
    number: String!
    createdAt: String!
  }
`;

export const productInputDefinition = gql`
  input ProductInput {
    artist: ID!
    name: String!
    description: String!
    value: Int!
    category: String!
    image: Upload
    number: String!
  }
`;
