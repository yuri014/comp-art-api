const getMentions = (str: string) => {
  const pattern = /\B@[a-z0-9_-]+/gi;

  return str.match(pattern);
};

export default getMentions;
