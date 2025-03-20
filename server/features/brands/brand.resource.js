import { Resource } from '#lib';
export default class BrandResource extends Resource {
  transform(brand) {
    const { _id, ...rest } = brand;
    return {
      id: _id,
      ...rest,
    };
  }
}
