interface GenericPost {
  createdAt: string;
}

const sortTimelineArray = (posts: Array<GenericPost>, shares: Array<GenericPost>) => {
  const concatPosts = posts.concat(shares as []);

  const sortedTimeline = concatPosts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return sortedTimeline;
};

export default sortTimelineArray;
