import { gql } from 'apollo-server-express';

const notificationsDefinitions = gql`
  type Notification {
    _id: String
    from: String
    body: String
    createdAt: String
    link: String
    read: Boolean
    avatar: String
  }
`;

export default notificationsDefinitions;
