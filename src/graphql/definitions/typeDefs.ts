import { gql } from 'apollo-server-express';

export const queries = gql`
  scalar Upload

  type File {
    url: String
  }

  type Query {
    getProfile(username: String!): Profile
    getLoggedProfile: Profile!
    getPost(id: ID!): Post
    getPosts(offset: Int!): [Post]
    getProfilePosts(offset: Int!, username: String!): [Post]
    getIsFollowing(username: String!): Boolean
    getExplorePosts(offset: Int!): [Post]
    getComments(postID: ID!, offset: Int!): [Comments]
    getLikes(postID: ID!, offset: Int!): [Profile]
    getFollowers(offset: Int!, username: String!): [Profile]
    getFollowing(offset: Int!, username: String!): [Profile]
  }
`;

export const mutations = gql`
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
    updateProfile(newProfileInput: CreateProfileInput): Boolean
    createSharePost(shareInput: SharePost!): Boolean
  }
`;
