import { BrandModel, CategoryModel, ReviewModel, SupplierModel } from '#features';
import { Service } from '#lib';
import OrderModel from '../orders/order.model.js';
import ProductModel from './product.model.js';

class ProductService extends Service {
  model = ProductModel;
  fieldToSlugify = 'name';

  async getProductStocks() {
    const data = await this.model.find({}).select('name stock');
    if (!data || !data.length) {
      throw new Error('No data found');
    }

    const totalStocks = data.reduce((acc, item) => acc + item.stock, 0);

    const totalPercentage = data.map((item) => ({
      name: item.name,
      stock: item.stock,
      percent: totalStocks
        ? ((item.stock / totalStocks) * 100).toFixed(2)
        : 0,
    }));
    return { totalPercentage, stocks: data, totalStocks };

  }

  async getReviewDetails(productId) {
    const product = await this.model.findById(productId).select('reviews');
    const reviews = await ReviewModel.find({ _id: { $in: product.reviews } });
    return reviews;
  }

  async filterProducts(filter, meta) {
    this._checkModel();
    const { filters, ...rest } = filter;

    const priceQuery = filters.price.map(p => ({ price: rest.priceRanges[p] }));

    const query = {
      $or: [
        ...priceQuery,
        { price: filter.range },
        { name: { $in: filters.categories } },
        { averageRating: { $gte: filters.rating } },
      ],
      name: { $regex: filter.categorySearch, $options: 'i' },
    };


    this.query = this.model.find(query);;
    return this.paginate(meta).exec();

  }

  async getCategoryId(name) {
    let category = await CategoryModel.findOne({ name });
    if (!category) {
      // Create new category if not found
      category = await CategoryModel.create({ name });
    }
    return category._id;
  }

  async getBrandId(name) {
    let brand = await BrandModel.findOne({ name });
    if (!brand) {
      // Create new brand if not found
      brand = await BrandModel.create({ name });
    }
    return brand._id;
  }

  async getSupplierId(name) {
    let supplier = await SupplierModel.findOne({ name });
    if (!supplier) {
      // Create new supplier if not found
      supplier = await SupplierModel.create({ name });
    }
    return supplier._id;
  }

  async getBySlug(slug) {
    this._checkModel();
    return this.model.findOne({ slug });
  }
}

export default new ProductService();
