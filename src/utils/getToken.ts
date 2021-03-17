interface Context {
  req: {
    headers: {
      authorization: string;
    };
  };
}

const getToken = (context: Context) => {
  const authHeader = context.req.headers.authorization;

  if (!authHeader) {
    return '';
  }

  const token = authHeader.split('Bearer ')[1];
  return token;
};

export default getToken;
