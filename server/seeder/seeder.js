import { faker } from '@faker-js/faker';

export class Seeder {
  constructor(service, count, reset = true) {
    this.service = service;
    this.count = count;
    this.reset = reset;
  }
  custom() {
    return [];
  }
  schema() {
    return {};
  }
  randomId(model) {
    let rand = Math.floor(Math.random() * model.length);
    let item = model[rand];
    return item?._id;
  }

  randomIds(model, count) {
    let ids = [];
    for (let i = 0; i < count; i++) {
      ids.push(this.randomId(model));
    }
    return ids;
  }

  async run() {
    try {
      const schema = this.schema();
      const custom = this.custom();

      console.log(`\n[${this.service.model.modelName}] Seeding data...`);
      let fakeData = Array.from({ length: this.count }, () => {
        const data = this.generate(schema);
        return data;
      });

      if (custom.length) {
        fakeData = [...fakeData, ...custom];
      }
      if (this.reset) {
        console.log(`[${this.service.model.modelName}] Resetting collection...`);
        await this.service.model.deleteMany({});
      }

      await this.service.insertMany(fakeData, { ordered: false });
      console.log(`[${this.service.model.modelName}] Data seeded successfully. Total: ${this.count}\n`);
    } catch (error) {
      console.error(`[${this.service.model.modelName}] Error seeding data: ${error.message}`);
    }
  }

  generate(schema) {
    const fakeData = {};
    for (const [field, fakerMethod] of Object.entries(schema)) {
      if (typeof fakerMethod === 'function') {
        fakeData[field] = fakerMethod();
      } else if (typeof fakerMethod === 'string') {
        const [category, method] = fakerMethod.split('.');
        if (faker[category] && faker[category][method]) {
          fakeData[field] = faker[category][method]();
        } else {
          console.warn(`${this.service.model.modelName}] Invalid faker method: ${fakerMethod}`);
        }
      }
    }
    return fakeData;
  }
}

