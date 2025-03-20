import { Resource } from '#lib';
import UserInfo from './user-info.model.js';
import UserModel from './user.model.js';
export default class UserResource extends Resource {
  async transform(user) {
    const userData = UserModel.filterHidden(user);
    const userInfo = userData ? await UserInfo.findById(userData?.info) : null;
    return {
      ...userData,
      id: user?._id,
      full_name: userInfo?.first_name + ' ' + userInfo?.last_name,
      info: userInfo,
      createdAt: this.formatDate(user?.createdAt),
    };
  }
}
