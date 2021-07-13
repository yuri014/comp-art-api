import { ReadStream } from 'fs-extra';

export type IOnModel = 'ArtistProfile' | 'UserProfile';

export type ID = { id: string };

export type ICreateReadStream = () => ReadStream;

export type IOffsetTimeline = [number, number];
