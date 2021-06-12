import { gql } from 'apollo-server-express';

const interactionsDefinitions = gql`
  type Likes {
    username: String
    avatar: String
    createdAt: String
  }

  type Comments {
    _id: ID!
    author: Profile!
    body: String!
    createdAt: String!
    likesCount: Int
  }

  type Comment {
    post: String!
    comments: [Comments]
  }
`;

export default interactionsDefinitions;
