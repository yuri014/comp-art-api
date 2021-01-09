import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    token: String!
    createdAt: String!
    updatedAt: String
  }

  type ArtistProfile {
    id: ID!
    name: String!
    avatar: String
    coverImage: String
    bio: String
    postCount: Int!
    followers: Int!
    following: Int!
    isBlockedToPost: Boolean!
    postsRemainingToUnblock: Int!
    createdAt: String!
    updatedAt: String
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
    avatar: String
    coverImage: String
    bio: String
    token: String!
  }

  type Query {
    getPosts: [Post]
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!
    confirmationEmail(token: String!): Boolean
    sendForgotPasswordEmail(email: String!): Boolean
    recoverPassword(token: String!, newPassword: String!): String!
    createArtistProfile(createProfileInput: CreateProfileInput): ArtistProfile!
  }
`;
export default typeDefs;
