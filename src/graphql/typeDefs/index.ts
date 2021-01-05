import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: String
    name: String
    username: String
    email: String
  }
  type Query {
    getUser: User
  }
`;
export default typeDefs;
