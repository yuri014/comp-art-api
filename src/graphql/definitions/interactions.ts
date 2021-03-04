import { gql } from 'apollo-server-express';

const interactionsDefinitions = gql`
  type Likes {
    username: String
    avatar: String
    createdAt: String
  }

  type Comments {
    author: Profile!
    body: String!
    createdAt: String!
  }

  type Comment {
    post: String!
    comments: [Comments]
  }
`;

export default interactionsDefinitions;
