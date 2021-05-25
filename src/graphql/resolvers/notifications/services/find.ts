import Notification from '../../../../entities/Notification';
import { IToken } from '../../../../interfaces/Token';

const findNotifications = async (user: IToken, offset: number) => {
  const notifications = await Notification.findOne({ user: user.id })
    .where('notifications')
    .slice([offset > 0 ? Math.round(offset / 2) : offset, offset + 4]);

  if (!notifications) {
    return [];
  }

  return notifications?.notifications;
};

export default findNotifications;
