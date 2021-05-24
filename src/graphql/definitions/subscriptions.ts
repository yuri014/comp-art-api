import { gql } from 'apollo-server-express';

const subscriptions = gql`
  type Notification {
    _id: String
    from: String
    body: String
    createdAt: String
    link: String
    read: Boolean
    avatar: String
  }

  type Subscription {
    notification: Notification!
  }
`;

export default subscriptions;
