import getUser from '../../../../../auth/getUser';
import { IToken } from '../../../../../interfaces/Token';
import getTimeline from '../utils/getTimeline';

const searchPostService = async (offset: number, query: string, token: string) => {
  const user = getUser(token);

  if (user) {
    const authUser = user as IToken;

    const timeline = await getTimeline(
      offset,
      {
        postQuery: { $text: { $search: query } },
        shareQuery: { $text: { $search: query } },
      },
      authUser,
    );

    return timeline;
  }

  const timeline = await getTimeline(offset, {
    postQuery: { $text: { $search: query } },
    shareQuery: { $text: { $search: query } },
  });

  return timeline;
};

export default searchPostService;
