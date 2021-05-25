import { gql } from 'apollo-server-express';

const mutations = gql`
  type Mutation {
    #users
    register(registerInput: RegisterInput!): Boolean
    login(email: String!, password: String!): User!
    confirmationEmail(code: String!, email: String!): User!
    sendForgotPasswordEmail(email: String!): Boolean
    recoverPassword(token: String!, newPassword: String!): String!
    resendConfirmationCode(email: String!): Boolean

    #profiles
    createProfile(createProfileInput: CreateProfileInput!): Boolean
    updateProfile(newProfileInput: CreateProfileInput): Boolean

    #follows
    follow(username: String!): Boolean
    unfollow(username: String!): Boolean

    #posts
    createPost(postInput: CreatePostInput!): Boolean
    deletePost(id: ID!): Boolean

    #post interactions
    like(id: ID!): Boolean
    dislike(id: ID!): Boolean

    #share
    createSharePost(shareInput: SharePost!): Boolean
    deleteShare(id: ID!): Boolean

    #share interactions
    likeShare(id: ID!): Boolean
    dislikeShare(id: ID!): Boolean

    #comment
    comment(postID: ID!, comment: String!): Boolean
    deleteComment(id: ID!): Boolean
    likeComment(id: ID!): Boolean
    dislikeComment(id: ID!): Boolean

    #saved posts
    addSavedPost(postID: ID!): Boolean
    deleteSavedPost(postID: ID!): Boolean

    #product
    createProduct(productInput: ProductInput!): Boolean

    #notifications
    readNotifications(notificationID: ID!): Boolean
  }
`;

export default mutations;
