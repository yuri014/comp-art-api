import { gql } from 'apollo-server-express';

const subscriptions = gql`
  type Notification {
    title: String
    body: String
    read: Boolean
    send: Boolean
  }

  type Subscription {
    notification: Notification!
  }
`;

export default subscriptions;
