import { UserInputError } from 'apollo-server-express';

import Post from '../../../../../entities/Post';
import { IPostInput } from '../../../../../interfaces/Post';
import { uploadBody, uploadThumbnail } from '../../../../../utils/uploadPost';
import managePostColors from './managePostColors';

export const createTextPost = async (profileID: string, description?: string) => {
  if (!description || description?.length === 0) {
    throw new UserInputError('Texto não pode ser vazio.');
  }

  const newPost = new Post({
    description: description.trim(),
    body: '',
    createdAt: new Date().toISOString(),
    mediaId: 4,
    artist: profileID,
    alt: '',
    thumbnail: '',
    darkColor: '',
    lightColor: '',
  });

  await newPost.save();
};

export const createMediaPost = async (post: IPostInput, profileID: string) => {
  const { body, mediaId } = await uploadBody(post.body);

  const thumbnailUrl = await uploadThumbnail(post.thumbnail);

  const { darkColor, lightColor } = await managePostColors(thumbnailUrl, body);

  const audioId = 2;

  if (mediaId === audioId && post.description.length < 2) {
    throw new UserInputError('Título do áudio é obrigatório');
  }

  const newPost = new Post({
    description: post.description?.trim(),
    body,
    createdAt: new Date().toISOString(),
    mediaId,
    artist: profileID,
    alt: post.alt,
    thumbnail: thumbnailUrl || '',
    darkColor,
    lightColor,
  });

  await newPost.save();
};
