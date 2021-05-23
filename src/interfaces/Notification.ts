import { IProfileEntity } from './Models';

interface INotification {
  profile: string | IProfileEntity;
  onModel: 'ArtistProfile' | 'UserProfile';
  notifications: Array<{
    title: string;
    body: string;
    read: boolean;
    send: boolean;
    createdAt: string;
    link: string;
  }>;
}

export default INotification;
