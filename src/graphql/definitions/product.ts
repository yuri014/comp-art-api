import { gql } from 'apollo-server-express';

export const productDefinition = gql`
  type Product {
    artist: Profile!
    name: String!
    description: String!
    price: Float!
    category: String!
    images: [String]
    createdAt: String!
  }
`;

export const productInputDefinition = gql`
  input ProductInput {
    name: String!
    description: String
    price: Float!
    category: String!
    images: [Upload]!
  }
`;
