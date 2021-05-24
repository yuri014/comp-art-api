import { gql } from 'apollo-server-express';

const subscriptions = gql`
  type Notification {
    _id: String
    title: String
    body: String
    createdAt: String
    link: String
    read: Boolean
  }

  type Subscription {
    notification: Notification!
  }
`;

export default subscriptions;
