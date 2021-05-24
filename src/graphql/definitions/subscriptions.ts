import { gql } from 'apollo-server-express';

const subscriptions = gql`
  type Subscription {
    notification: Notification!
  }
`;

export default subscriptions;
