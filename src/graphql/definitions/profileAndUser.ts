import { gql } from 'apollo-server-express';

export const profileDefinitions = gql`
  type Links {
    soundcloud: String
    twitter: String
    facebook: String
    wattpad: String
    pinterest: String
    deviantart: String
    bandcamp: String
    customLink: String
  }

  type Profile {
    _id: String
    name: String!
    avatar: String
    coverImage: String
    bio: String
    xp: Int!
    level: Int!
    followers: Int!
    following: Int!
    hashtags: [String]
    owner: String!
    links: Links
    isArtist: Boolean!
    sharedPostCount: Int
    postCount: Int
    phone: String
    createdAt: String
  }
`;

export const userDefinitions = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    token: String
    createdAt: String!
    updatedAt: String
  }
`;

export const userAndProfileInputsDefinitions = gql`
  input RegisterInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
    isArtist: Boolean!
  }

  input CreateProfileInput {
    name: String!
    avatar: Upload
    coverImage: Upload
    bio: String
    hashtags: [String]
    links: InputLinks
  }

  input InputLinks {
    soundcloud: String
    twitter: String
    facebook: String
    wattpad: String
    pinterest: String
    deviantart: String
    bandcamp: String
    customLink: String
  }
`;
