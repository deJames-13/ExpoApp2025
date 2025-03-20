import { BrandService } from '#features';
import { faker } from '@faker-js/faker';
import { Seeder } from './seeder.js';

class BrandSeeder extends Seeder {
  schema() {
    return {
      name: ()=>faker.commerce.department() + " " + faker.string.alpha({ length: 6, casing: 'upper', exclude: ['A'] }),
      description: faker.company.buzzPhrase,
      websiteUrl: faker.internet.url,
      emailAddress: faker.internet.email,
    };
  }
}

export const brandSeeder = async (count = 10) => {
  const seeder = new BrandSeeder(BrandService, count);
  await seeder.run();
};

