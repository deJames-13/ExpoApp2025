import { Resource } from '#lib';
export default class CourierResource extends Resource {
  async transform(courier) {
    const { _id, ...rest } = courier;
    return {
      id: _id,
      ...rest,
    };
  }
}

