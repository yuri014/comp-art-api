import { gql } from 'apollo-server-express';

const queries = gql`
  scalar Upload

  extend type Profile {
    followsYou: Boolean
  }

  union Timeline = Post | Share

  type Query {
    #profiles
    getLoggedProfile: Profile!
    getSuggestedProfiles: [Profile]
    getProfile(username: String!): Profile
    searchProfiles(query: String!, offset: Int!, limit: Int!): [Profile]

    #follows
    getIsFollowing(id: String!): Boolean
    getFollowers(offset: Int!, username: String!): [Profile]
    getFollowing(offset: Int!, username: String!): [Profile]

    #posts
    getPost(id: ID!): Post
    getPosts(offset: Int!): [Timeline]
    getProfilePosts(offset: Int!, username: String!): [Timeline]
    getExplorePosts(offset: Int!): [Post]
    searchPost(query: String!, offset: Int!): [Post]
    getPostByTag(tag: String!, offset: Int!): [Timeline]

    #post interactions
    getComments(postID: ID!, offset: Int!): [Comments]
    getLikes(postID: ID!, offset: Int!): [Profile]
    getWhoSharesPost(postID: ID!, offset: Int!): [Profile]

    #notifications
    getNotifications(offset: Int!): [Notification]
  }
`;

export default queries;
