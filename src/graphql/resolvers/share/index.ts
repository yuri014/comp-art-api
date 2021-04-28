import { AuthenticationError, IResolvers, UserInputError } from 'apollo-server-express';
import ArtistProfile from '../../../entities/ArtistProfile';
import Share from '../../../entities/Share';
import UserProfile from '../../../entities/UserProfile';

import { IShareInput } from '../../../interfaces/Share';
import checkAuth from '../../../middlewares/checkAuth';
import levelDown from '../../../utils/levelDown';
import xpValues from '../../../utils/xpValues';
import createShare from './services/create';

const options = {
  new: true,
  useFindAndModify: false,
};

const shareResolvers: IResolvers = {
  Mutation: {
    async createSharePost(_, { shareInput }: { shareInput: IShareInput }, context) {
      const user = checkAuth(context);

      return createShare(user, shareInput);
    },
    async deleteShare(_, { id }: { id: string }, context) {
      const user = checkAuth(context);
      const share = await Share.findById(id).populate('profile');

      if (!share) {
        throw new UserInputError('Não há compartilhamento');
      }

      if (share.profile !== user.username) {
        throw new AuthenticationError('Você não é o autor deste compartilhamento');
      }

      try {
        await share.deleteOne();
      } catch (error) {
        throw new Error(error);
      }

      const updateProfile = async () => {
        if (user.isArtist) {
          const artist = await ArtistProfile.findOne({ owner: user.username });

          return artist?.updateOne(
            {
              $inc: {
                postCount: artist.postCount > 0 ? -1 : 0,
              },
            },
            options,
          );
        }

        return UserProfile.findOneAndUpdate(
          { owner: user.username },
          {
            $inc: {
              sharedPostCount: -1,
            },
          },
          options,
        );
      };

      const updatedProfile = await updateProfile();

      const { shareXP } = xpValues;

      return levelDown(updatedProfile, shareXP);
    },
  },
};

export default shareResolvers;
