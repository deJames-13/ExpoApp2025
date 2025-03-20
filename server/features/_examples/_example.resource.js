import { Resource } from '#lib';
export default class _ExampleResource extends Resource {
  transform(_example) {
    const { _id, ...rest } = _example;
    return {
      id: _id,
      ...rest,
    };
  }
}
