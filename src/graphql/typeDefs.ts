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
    url: String
  }

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
  }

  type Likes {
    username: String
    avatar: String
    createdAt: String
  }

  type Post {
    description: String
    body: String
    likes: Likes
    sharedCount: Int!
    createdAt: String!
    artist: String!
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
    hashtags: [String]
    links: InputLinks
  }

  input CreatePostInput {
    description: String!
    body: Upload!
  }

  type Query {
    getProfile(username: String!): Profile
    getLoggedProfile: Profile!
    getPosts(offset: Int!): [Post]
  }

  type Mutation {
    register(registerInput: RegisterInput!): Boolean
    login(email: String!, password: String!): User!
    confirmationEmail(token: String!): User!
    sendForgotPasswordEmail(email: String!): Boolean
    recoverPassword(token: String!, newPassword: String!): String!
    createProfile(createProfileInput: CreateProfileInput!): Boolean
    follow(username: String!): Boolean
    createPost(postInput: CreatePostInput!): Boolean
  }
`;
export default typeDefs;
