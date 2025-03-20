import { SupplierService } from '#features';
import { faker } from '@faker-js/faker';
import { Seeder } from './seeder.js';

class SupplierSeeder extends Seeder {
  schema() {
    return {
      name: ()=>faker.commerce.department() + ' ' + faker.string.alpha({ length: 6, casing: 'upper', exclude: ['A'] }),
      contactPerson: faker.person,
      emailAddress: faker.internet.email,
      contactNumber: faker.phone.number,
      description: faker.company.buzzPhrase,
    };
  }
}

export const supplierSeeder = async (count = 10) => {
  const seeder = new SupplierSeeder(SupplierService, count);
  await seeder.run();
};

