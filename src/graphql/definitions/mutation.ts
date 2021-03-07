import { gql } from 'apollo-server-express';

const mutations = gql`
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
    likeComment(id: ID!): Boolean
  }
`;

export default mutations;
