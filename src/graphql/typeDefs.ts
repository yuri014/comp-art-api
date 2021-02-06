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
    sharedPostCount: Int
    postCount: Int
  }

  type Likes {
    username: String
    avatar: String
    createdAt: String
  }

  type PostArtist {
    name: String!
    username: String!
  }

  type Post {
    _id: String!
    description: String
    body: String!
    likes: Likes
    likesCount: Int!
    sharedCount: Int!
    commentsCount: Int!
    createdAt: String!
    artist: PostArtist!
    isAudio: Boolean!
    avatar: String!
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
    isAudio: Boolean!
  }

  type Query {
    getProfile(username: String!): Profile
    getLoggedProfile: Profile!
    getPosts(offset: Int!): [Post]
    getProfilePosts(offset: Int!, username: String!): [Post]
    getIsFollowing(username: String!): Boolean
  }

  type Mutation {
    register(registerInput: RegisterInput!): Boolean
    login(email: String!, password: String!): User!
    confirmationEmail(token: String!): User!
    sendForgotPasswordEmail(email: String!): Boolean
    recoverPassword(token: String!, newPassword: String!): String!
    createProfile(createProfileInput: CreateProfileInput!): Boolean
    follow(username: String!): Boolean
    unfollow(username: String!): Boolean
    createPost(postInput: CreatePostInput!): Boolean
    like(id: ID!): Boolean
  }
`;
export default typeDefs;
