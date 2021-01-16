import { gql } from 'apollo-server-express';

const typeDefs = gql`
  scalar Upload

  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    token: String
    createdAt: String!
    updatedAt: String
  }

  type File {
    url: String!
  }

  type ArtistProfile {
    id: ID!
    name: String!
    avatar: File
    coverImage: File
    bio: String
    xp: Int!
    level: Int!
    postCount: Int!
    followers: Int!
    following: Int!
    isBlockedToPost: Boolean!
    postsRemainingToUnblock: Int!
  }

  type UserProfile {
    id: ID!
    name: String!
    avatar: File
    coverImage: File
    bio: String
    xp: Int!
    level: Int!
    sharedPostCount: Int!
    followers: Int!
    following: Int!
  }

  type Profile {
    name: String!
    avatar: File
    coverImage: File
    bio: String
    xp: Int!
    level: Int!
    followers: Int!
    following: Int!
  }

  type Post {
    id: ID!
    description: String!
    username: String!
    name: String!
  }

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
  }

  type Query {
    getProfile: Profile
    getPosts: [Post]
  }

  type Mutation {
    register(registerInput: RegisterInput!): Boolean
    login(email: String!, password: String!): User!
    confirmationEmail(token: String!): User!
    sendForgotPasswordEmail(email: String!): Boolean
    recoverPassword(token: String!, newPassword: String!): String!
    createProfile(createProfileInput: CreateProfileInput!): Boolean
  }
`;
export default typeDefs;
