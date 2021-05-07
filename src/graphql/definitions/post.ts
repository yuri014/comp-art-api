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
    _id: String!
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
    darkColor: String!
    lightColor: String!
  }

  type Share {
    _id: String!
    description: String
    post: Post!
    likes: [PostLikes]
    likesCount: Int!
    sharedCount: Int!
    commentsCount: Int!
    profile: Profile!
    createdAt: String!
    isLiked: Boolean
  }
`;

export const postInputDefinitions = gql`
  input CreatePostInput {
    description: String!
    body: Upload
    mediaId: Int!
    alt: String
    thumbnail: Upload
  }

  input SharePost {
    postID: String!
    description: String!
  }
`;
