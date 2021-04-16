import { gql } from 'apollo-server-express';

const queries = gql`
  scalar Upload

  type File {
    url: String
  }

  extend type Profile {
    followsYou: Boolean
  }

  union Timeline = Post | Share

  type Query {
    getProfile(username: String!): Profile
    getLoggedProfile: Profile!
    getPost(id: ID!): Post
    getPosts(offset: Int!): [Timeline]
    getProfilePosts(offset: Int!, username: String!): [Post]
    getIsFollowing(id: String!): Boolean
    getExplorePosts(offset: Int!): [Post]
    getComments(postID: ID!, offset: Int!): [Comments]
    getLikes(postID: ID!, offset: Int!): [Profile]
    getFollowers(offset: Int!, username: String!): [Profile]
    getFollowing(offset: Int!, username: String!): [Profile]
    searchProfiles(query: String!, offset: Int!, limit: Int!): [Profile]
    searchPost(query: String!, offset: Int!): [Post]
    getSuggestedProfiles: [Profile]
  }
`;

export default queries;
