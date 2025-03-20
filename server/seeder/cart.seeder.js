import { CartService, ProductModel as Product, UserModel as User } from '#features';
import { faker } from '@faker-js/faker';
import { Seeder } from './seeder.js';

class CartSeeder extends Seeder {
  constructor(service, count) {
    super(service, count);
    this.user = null;
    this.product = null;
  }

  async before() {
    this.user = await User.find({});
    this.product = await Product.find({});
  }

  schema() {
    return {
      user: () => {
        let randU = Math.floor(Math.random() * this.user.length);
        let user = this.user[randU];
        return user._id;
      },
      product: () => {
        let randP = Math.floor(Math.random() * this.product.length);
        let product = this.product[randP];
        return product._id;
      },
      quantity: () => faker.number.int({ min: 1, max: 10 }),
      price: () => parseFloat(faker.commerce.price({ min: 1000, max: 5000 })),
    };
  }

  async run() {
    await this.before();
    await super.run();
  }
}

export const cartSeeder = async (count = 10) => {
  const seeder = new CartSeeder(CartService, count);
  await seeder.run();
};

