import { UserModel, UserResource } from '#features';
import { Resource } from '#lib';
export default class ReviewResource extends Resource {
  async transform(review) {
    if (!review) return {}
    let { _id, user, ...rest } = review;
    let userData = await UserModel.findById(user);
    let userResource = await UserResource.make(userData);;
    user = rest.isAnonymous ? null : {
      username: userResource?.username,
      full_name: userResource?.full_name,
      avatar: userResource?.info?.avatar?.url,
    }
    
    return {
      id: _id,
      user: rest.isAnonymous || !user ? 'Anon' : user,
      ...rest,
    };
  }
}
