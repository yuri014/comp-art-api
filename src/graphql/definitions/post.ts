import { gql } from 'apollo-server-express';

export const postDefinitions = gql`
  type PostArtist {
    _id: ID!
    name: String!
    owner: String!
    avatar: String
  }

  type PostLikes {
    profile: Profile
  }

  type SavedPosts {
    _id: ID!
    posts: [Timeline]
  }

  type Post {
    _id: ID!
    description: String
    body: String!
    likes: [PostLikes]
    likesCount: Int!
    sharedCount: Int!
    commentsCount: Int!
    createdAt: String!
    artist: PostArtist!
    mediaId: Int!
    isLiked: Boolean
    alt: String
    darkColor: String
    lightColor: String
    thumbnail: String
    imageHeight: String
    title: String
    isSaved: Boolean
  }

  type Share {
    _id: ID!
    description: String
    post: Post!
    likes: [PostLikes]
    likesCount: Int!
    commentsCount: Int!
    profile: Profile!
    createdAt: String!
    isLiked: Boolean
    imageHeight: String
    isSaved: Boolean
  }

  type ShareResponse {
    levelUp: Boolean!
    isFreeToPost: Boolean
  }
`;

export const postInputDefinitions = gql`
  input CreatePostInput {
    description: String!
    body: Upload
    alt: String
    thumbnail: Upload
    title: String
  }

  input SharePost {
    postID: String!
    description: String!
  }
`;
