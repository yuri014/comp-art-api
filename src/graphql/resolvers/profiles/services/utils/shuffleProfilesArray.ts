const shuffleProfileArray = (artists: Array<unknown>, users: Array<unknown>) => {
  const profiles = artists.concat(users as []);

  const shuffledProfiles = profiles.sort(() => Math.random() - 0.5);

  return shuffledProfiles;
};

export default shuffleProfileArray;
