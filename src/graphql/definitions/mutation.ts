import { gql } from 'apollo-server-express';

const mutations = gql`
  type Mutation {
    register(registerInput: RegisterInput!): Boolean
    login(email: String!, password: String!): User!
    confirmationEmail(code: String!, email: String!): User!
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
    deleteComment(id: ID!): Boolean
    updateProfile(newProfileInput: CreateProfileInput): Boolean
    createSharePost(shareInput: SharePost!): Boolean
    likeComment(id: ID!): Boolean
    dislikeComment(id: ID!): Boolean
    createProduct(productInput: ProductInput!): Boolean
  }
`;

export default mutations;
