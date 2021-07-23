const cookieToJson = (cookie: string): { [key: string]: string } =>
  cookie.split('; ').reduce((res, c) => {
    const [key, value] = c.split('=');

    if (!value) {
      return {};
    }

    return { ...res, [key]: decodeURIComponent(value) };
  }, {});

export default cookieToJson;
