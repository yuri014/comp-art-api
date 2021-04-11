import { gql } from 'apollo-server-express';

export const postDefinitions = gql`
  type PostArtist {
    name: String!
    owner: String!
    avatar: String
  }

  type PostLikes {
    profile: Profile
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
    avatar: String!
    isLiked: Boolean
    alt: String
  }
`;

export const postInputDefinitions = gql`
  input CreatePostInput {
    description: String!
    body: Upload!
    mediaId: Int!
    alt: String
  }

  input SharePost {
    postID: String!
    description: String!
  }
`;
