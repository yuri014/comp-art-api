import getUser from '../../../../../auth/getUser';
import ArtistProfile from '../../../../../entities/ArtistProfile';
import Post from '../../../../../entities/Post';
import { IToken } from '../../../../../interfaces/Token';
import getPostView from '../utils/postView';

const getArtistPosts = async (token: string, username: string, offset: number) => {
  const user = getUser(token);
  const artist = await ArtistProfile.findOne({ owner: username }).lean();

  if (!artist) {
    return [];
  }

  const profileID = artist._id;

  const posts = await Post.find({ artist: profileID })
    .skip(offset)
    .limit(5)
    .sort({ createdAt: -1 })
    .populate('artist')
    .where('likes')
    .slice([0, 3])
    .populate('likes.profile');

  if (!posts) {
    return [];
  }
  if (user) {
    const authUser = user as IToken;

    const postsView = await getPostView({ posts, profileID, userID: authUser.id });

    return postsView;
  }

  return posts;
};

export default getArtistPosts;
