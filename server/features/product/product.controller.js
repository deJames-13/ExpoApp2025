import { validate } from '#common';
import { ReviewResource } from '#features';
import { Controller } from '#lib';
import ProductResource from './product.resource.js';
import ProductService from './product.service.js';
import {
  productCreateRules,
  productUpdateRules,
} from './product.validation.js';

class ProductController extends Controller {
  service = ProductService;
  resource = ProductResource;
  rules = {
    create: productCreateRules,
    update: productUpdateRules,
  };

  getReviewDetails = async (req, res) => {
    const data = await this.service.getReviewDetails(req.params.id);
    if (!data) return this.error({ res, message: 'Data not found!' });

    const resource = (await ReviewResource?.collection(data)) || data;
    this.success({ res, message: 'Data fetched!', resource });
  };

  getFilteredProducts = async (req, res) => {
    const data = req.body;
    const meta = await this.service._getMeta(data.queries, res);
    const products = await this.service.filterProducts(data, meta);
    const message = products.length
      ? 'Data collection fetched!'
      : 'No data found!';

    const resource = (await this.resource?.collection(products)) || products;
    this.success({
      res,
      message,
      resource,
      meta: { ...meta, count: data.length },
    });
  };

  getBySlug = async (req, res) => {
    const { slug } = req.params;
    const data = await this.service.getBySlug(slug);
    if (!data?._id) return this.error({ res, message: 'Data not found!' });

    const resource = (await this.resource?.make(data)) || data;
    this.success({ res, message: 'Data fetched!', resource });
  };

  store = async (req, res) => {
    let validData = req.body;
    if (!this.rules.create.length)
      validData = await this.validator(req, res, this.rules.create);

    if (!validData.brand || !validData.supplier || !validData.category) {
      return this.error({ res, message: 'Brand, Supplier, and Category are required!' });
    }
    if (validData.category) {
      validData.category = await this.service.getCategoryId(validData.category);
    }
    validData.brand = await this.service.getBrandId(validData.brand);
    validData.supplier = await this.service.getSupplierId(validData.supplier);

    let data = await this.service?.create(validData);
    if (!data._id) return this.error({ res, message: 'Invalid data!' });

    console.log('files', req.files);
    if (req.file || req.files || this.service.hasField('images')) {
      const images = this.addImage(req);
      data.images = [...(data.images || []), ...images];
      await data.save();
    }

    const resource = (await this.resource?.make(data)) || data;
    this.success({ res, message: 'Data created!', resource });
  };

  // Method to update an existing product
  update = async (req, res) => {
    let validData = req.body;
    if (!this.rules.update.length)
      validData = await this.validator(req, res, this.rules.update);

    if (!validData.brand || !validData.supplier || !validData.category) {
      return this.error({ res, message: 'Brand, Supplier, and Category are required!' });
    }

    const brandId = await this.service.getBrandId(validData.brand);
    const supplierId = await this.service.getSupplierId(validData.supplier);
    const categoryId = await this.service.getCategoryId(validData.category)
    validData.brand = brandId;
    validData.supplier = supplierId;
    validData.category = categoryId;

    let data = await this.service?.update(req.params.id, validData);
    if (!data._id) return this.error({ res, message: 'Invalid data!' });

    if (req.file || req.files || this.service.hasField('images')) {
      const images = this.addImage(req);
      const oldImages = new Set(
        (data.images || []).map((image) => image.public_id)
      );
      const newImages = images.filter(
        (image) => !oldImages.has(image.public_id)
      );
      data.images = [...(data.images || []), ...newImages];
      data = await data.save();
    }
    console.log('files', data);

    const resource = (await this.resource?.make(data)) || data;
    this.success({ res, message: 'Data updated!', resource });
  };

  productSales = async (req, res) => {
    try {
      const { totalSales, sales } = await this.service.getProductSales();

      // Check if totalSales or sales are empty or undefined
      if (!totalSales || totalSales.length === 0) {
        return this.error({ res, message: 'No total sales data found!' });
      }

      if (!sales || sales.length === 0) {
        return this.error({ res, message: 'No sales data found!' });
      }

      const totalAmount = totalSales[0].total;
      const totalPercentage = sales.map((item) => ({
        name: item.name,
        percent: Number(((item.total / totalAmount) * 100).toFixed(2)),
      }));

      return this.success({
        res,
        message: 'Product sales fetched successfully!',
        resource: { totalPercentage, sales, totalSales: totalAmount },
      });
    } catch (error) {
      return this.error({ res, message: error.message });
    }
  };

  productStocks = async (req, res) => {
    try {
      // Get all products with stock information
      const { totalPercentage, stocks, totalStocks } = await this.service.getProductStocks();

      return this.success({
        res,
        message: 'Product stocks fetched successfully!',
        resource: { totalPercentage, stocks, totalStocks },
      });
    } catch (error) {
      console.error('Error fetching product stocks:', error);
      return this.error({
        res,
        message: 'An error occurred while fetching product stocks!',
      });
    }
  };
}

export default new ProductController();
