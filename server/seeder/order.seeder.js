import { OrderService, ProductModel, ReviewService, UserModel } from '#features';
import { faker } from '@faker-js/faker';
import { Seeder } from './seeder.js';

class OrderSeeder extends Seeder {
  constructor(service, count, reset) {
    super(service, count, reset);
    this.user = null;
    this.product = null;
    this.selectedUser = null;
    this.statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    


  }
  async before() {
    this.user = await UserModel.find({});
    this.product = await ProductModel.find({});
  }

  randomUser() {
    let rand = Math.floor(Math.random() * this.user.length);
    let user = this.user[rand];
    this.selectedUser = user;
    return user._id;
  }


  schema() {
    return {
      user: () => this.randomUser(this.user),
      status: () => faker.helpers.arrayElement(['cancelled', 'delivered']),
      note: faker.lorem.sentence,
      products: () => {
        let count = faker.number.int({ min: 1, max: 10 });
        return this.randomIds(this.product, count).map((product) => {
          return {
            product,
            quantity: faker.number.int({ min: 1, max: 10 }),
          };
        });
      },
      shipping: () => ({
        address: faker.location.streetAddress(),
      }),
      createdAt: () => faker.date.between({
        to: new Date(),
        from: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      }),

    };
  }
  async run() {
    await this.before();
    await super.run();
  }
}

export const orderSeeder = async (count = 10, reset) => {
  const seeder = new OrderSeeder(OrderService, count, reset);
  await seeder.run();
};

