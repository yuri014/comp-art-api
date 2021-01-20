import { Document } from 'mongoose';

export interface Followers extends Document {
  _doc: Followers;
  username: string;
  userFollowers: {
    username: string;
  };
  artistFollowers: {
    username: string;
  };
}

export interface Following extends Document {
  _doc: Following;
  username: string;
  userFollowing: {
    username: string;
  };
  artistFollowing: {
    username: string;
  };
}
