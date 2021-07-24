import { ObjectId } from 'mongodb';
import { UserInputError } from 'apollo-server-express';

import Post from '../../../../../entities/Post';
import { IPostInput } from '../../../../../interfaces/Post';
import { uploadBody, uploadThumbnail } from '../../../../../utils/uploadPost';
import managePostColors from './managePostColors';

export const createTextPost = async (profileID: string | ObjectId, description?: string) => {
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

  return newPost;
};

export const createMediaPost = async (post: IPostInput, profileID: string) => {
  const validateAudioTitle = () => {
    if (post.title.length < 2) {
      throw new UserInputError('Título do áudio é obrigatório');
    }
  };

  const { body, mediaId } = await uploadBody(post.body, validateAudioTitle);

  const thumbnailUrl = await uploadThumbnail(post.thumbnail);

  const { darkColor, lightColor } = await managePostColors(thumbnailUrl, body, mediaId);

  const newPost = new Post({
    description: post.description?.trim(),
    body,
    createdAt: new Date().toISOString(),
    title: post.title ? post.title.trim() : '',
    mediaId,
    artist: profileID,
    alt: post.alt,
    thumbnail: thumbnailUrl || '',
    darkColor,
    lightColor,
  });

  await newPost.save();

  return newPost;
};
