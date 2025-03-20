import { CategoryService } from '#features';
import { faker } from '@faker-js/faker';
import { Seeder } from './seeder.js';

class CategorySeeder extends Seeder {
  schema() {
    return {
      name: ()=>faker.commerce.department() + " " + faker.string.alpha({ length: 6, casing: 'upper', exclude: ['A'] }),
    };
  }
}

export const categorySeeder = async (count = 10) => {
  const seeder = new CategorySeeder(CategoryService, count);
  await seeder.run();
};

