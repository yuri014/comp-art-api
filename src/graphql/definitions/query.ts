import { gql } from 'apollo-server-express';

const queries = gql`
  scalar Upload

  type File {
    url: String
  }

  extend type Profile {
    followsYou: Boolean
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
    searchProfiles(query: String!, offset: Int!, limit: Int!): [Profile]
    searchPost(query: String!, offset: Int!): [Post]
  }
`;

export default queries;
