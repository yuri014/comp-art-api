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
    owner: String!
    avatar: String
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
    isLiked: Boolean
  }

  type Comments {
    author: Profile!
    body: String!
    createdAt: String!
  }

  type Comment {
    post: String!
    comments: [Comments]
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
    getPost(id: ID!): Post
    getPosts(offset: Int!): [Post]
    getProfilePosts(offset: Int!, username: String!): [Post]
    getIsFollowing(username: String!): Boolean
    getExplorePosts(offset: Int!): [Post]
    getComments(postID: ID!, offset: Int!): Comment
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
    deletePost(id: ID!): Boolean
    like(id: ID!): Boolean
    dislike(id: ID!): Boolean
    comment(postID: ID!, comment: String!): Boolean
  }
`;
export default typeDefs;
