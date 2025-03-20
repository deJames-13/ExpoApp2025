import { brandSeeder } from './brand.seeder.js';
import { cartSeeder } from './cart.seeder.js';
import { categorySeeder } from './category.seeder.js';
import { orderSeeder } from './order.seeder.js';
import { productSeeder } from './product.seeder.js';
import { reviewSeeder } from './review.seeder.js';
import { supplierSeeder } from './supplier.seeder.js';
import { createAdmin, userSeeder } from './user.seeder.js';

// Dependencies for product seeding
const prodDeps = async () =>
  await Promise.all([
    brandSeeder(),
    categorySeeder(),
    supplierSeeder(),
  ]);

// Transactions: cart and order seeders
const transaction = async () =>
  await Promise.all([
    cartSeeder(20),
    orderSeeder(500),
    // ...Array.from({ length: 50 }, orderSeeder(10, false)),
  ]);

const products = async () =>
  await Promise.all([
    ...Array.from({ length: 10 }, productSeeder(15, false)),
  ])

const reviews = async () =>
  await Promise.all([
    ...Array.from({ length: 15 }, reviewSeeder(10, false)),
  ])

const main = async () => {
  console.log('Seeding users...');
  await userSeeder();
  console.log('Users seeded');

  console.log('Seeding product dependencies...');
  await prodDeps();
  console.log('Product dependencies seeded');

  console.log('Seeding products...');
  await productSeeder(69);
  console.log('Products seeded');

  console.log('Seeding transactions...');
  await transaction();
  console.log('Transactions seeded');

  console.log('Seeding reviews...');
  await reviewSeeder(111);
  console.log('Reviews seeded');
};

export const RunSeeders = async () => {
  if (!(process.env.ENABLE_SEED != 'true' || process.env.NODE_ENV === 'production')) {
    console.log('Running seeders...');
    await main();
    console.log('Seeders completed'); 
  }
  await createAdmin(); 
};
