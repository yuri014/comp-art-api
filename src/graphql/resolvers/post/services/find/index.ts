import getExplorePostsService from './explorePosts';
import getTimelinePosts from './timeline';
import getPostLikes from './likes';
import getProfilePostsAndSharesService from './profilePostsAndShares';
import getPostService from './post';
import getArtistPosts from './artistsPosts';
import searchPostService from './search';

const FindPosts = {
  getExplorePostsService,
  getTimelinePosts,
  getPostLikes,
  getPostService,
  getArtistPosts,
  searchPostService,
  getProfilePostsAndSharesService,
};

export default FindPosts;
