import { validate } from '#common';
import { ReviewResource } from '#features';
import { Controller } from '#lib';
import ProductResource from './product.resource.js';
import ProductService from './product.service.js';
import {
  productCreateRules,
  productUpdateRules,
} from './product.validation.js';
import mongoose from 'mongoose';

class ProductController extends Controller {
  service = ProductService;
  resource = ProductResource;
  rules = {
    create: productCreateRules,
    update: productUpdateRules,
  };

  getAll = async (req, res) => {
    try {
      // Use aggregation pipeline instead of simple queries
      if (req.query.all) {
        const data = await this.service?.getAll();
        const message = data.length ? 'Data collection fetched!' : 'No data found!';
        const resource = (await this.resource?.collection(data)) || data;
        return this.success({ res, message, resource, meta: { count: data.length } });
      }

      // Process the query parameters
      const processedQuery = this._processQueryParams(req.query);
      console.log(processedQuery);

      // Parse pagination parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Build aggregation pipeline
      const pipeline = this._buildAggregationPipeline(processedQuery, skip, limit);

      // Execute the pipeline
      const data = await this.service.model.aggregate(pipeline);

      // Get total count for pagination
      const countPipeline = this._buildAggregationPipeline(processedQuery);
      countPipeline.push({ $count: 'total' });
      const countResult = await this.service.model.aggregate(countPipeline);

      const total = countResult.length > 0 ? countResult[0].total : 0;
      const meta = {
        page,
        limit,
        total,
        count: data.length,
        pages: Math.ceil(total / limit)
      };

      const message = data.length ? 'Data collection fetched!' : 'No data found!';
      const resource = (await this.resource?.collection(data)) || data;

      this.success({ res, message, resource, meta });
    } catch (error) {
      console.error('Error fetching products:', error);
      return this.error({
        res,
        message: 'An error occurred while fetching products',
        error
      });
    }
  };

  _buildAggregationPipeline(query, skip = null, limit = null) {
    const pipeline = [];

    // Match stage for filtering
    const matchStage = {};

    // Handle name search
    if (query.name && query.name.$regex) {
      matchStage.name = {
        $regex: query.name.$regex,
        $options: query.name.$options || 'i'
      };
    }

    // Handle category filtering
    if (query.category) {
      try {
        matchStage.category = new mongoose.Types.ObjectId(query.category);
      } catch (error) {
        console.error('Invalid category ID:', error);
        // If the ID is invalid, use it as is (will likely match nothing)
        matchStage.category = query.category;
      }
    }

    // Handle price range
    if (query.price) {
      matchStage.price = {};
      if (query.price.$gte !== undefined) {
        matchStage.price.$gte = parseFloat(query.price.$gte);
      }
      if (query.price.$lte !== undefined) {
        matchStage.price.$lte = parseFloat(query.price.$lte);
      }
    }

    // Add match stage if not empty
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Handle population/lookup of related entities
    pipeline.push(
      // Lookup category
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryDetails'
        }
      },
      // Unwind category (converts array to object)
      {
        $unwind: {
          path: '$categoryDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      // Lookup brand
      {
        $lookup: {
          from: 'brands',
          localField: 'brand',
          foreignField: '_id',
          as: 'brandDetails'
        }
      },
      // Unwind brand
      {
        $unwind: {
          path: '$brandDetails',
          preserveNullAndEmptyArrays: true
        }
      }
    );

    // Handle sorting
    if (query.sort) {
      const sortStage = {};
      const sortField = query.sort.startsWith('-')
        ? query.sort.substring(1)
        : query.sort;
      const sortDirection = query.sort.startsWith('-') ? -1 : 1;
      sortStage[sortField] = sortDirection;
      pipeline.push({ $sort: sortStage });
    } else {
      // Default sort by creation date (newest first)
      pipeline.push({ $sort: { createdAt: -1 } });
    }

    // Add pagination if specified
    if (skip !== null) {
      pipeline.push({ $skip: skip });
    }

    if (limit !== null) {
      pipeline.push({ $limit: limit });
    }

    return pipeline;
  }

  // Helper method to process query parameters for MongoDB compatibility
  _processQueryParams(query) {
    const processedQuery = { ...query };

    // Handle numeric operators for price ranges
    Object.keys(processedQuery).forEach(key => {
      // Check if the key contains MongoDB operator syntax like price[$gte]
      if (key.includes('[$')) {
        const matches = key.match(/^(\w+)\[(.*)\]$/);
        if (matches) {
          const [, field, operator] = matches;

          // Create the field in the query if it doesn't exist
          if (!processedQuery[field]) {
            processedQuery[field] = {};
          }

          // Convert value to number if it's a numeric field
          const value = ['price', 'quantity', 'averageRating'].includes(field)
            ? processedQuery[key]  // Keep as string for now, convert in aggregation
            : processedQuery[key];

          // Set the operator with its value
          processedQuery[field][operator] = value;

          // Remove the original key with the operator syntax
          delete processedQuery[key];
        }
      }
    });

    return processedQuery;
  }

  // ... rest of the controller methods remain unchanged
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

    try {
      // Handle brand, category, and supplier - create if they don't exist
      if (validData.category) {
        validData.category = await this.service.getCategoryId(validData.category);
      }

      if (validData.brand) {
        validData.brand = await this.service.getBrandId(validData.brand);
      }

      if (validData.supplier) {
        validData.supplier = await this.service.getSupplierId(validData.supplier);
      }

      let data = await this.service?.create(validData);
      if (!data._id) return this.error({ res, message: 'Invalid data!' });

      // Enhanced image handling for multiple sources (multer files or base64)
      if (req.file || req.files || req.base64File || req.base64Files || this.service.hasField('images')) {
        const images = this.addImage(req);
        data.images = [...(data.images || []), ...images];
        await data.save();
      }

      const resource = (await this.resource?.make(data)) || data;
      this.success({ res, message: 'Data created!', resource });
    } catch (error) {
      return this.error({ res, message: error.message });
    }
  };

  // Method to update an existing product
  update = async (req, res) => {
    let validData = req.body;
    if (!this.rules.update.length)
      validData = await this.validator(req, res, this.rules.update);

    try {
      // Handle brand, category, and supplier - create if they don't exist
      if (validData.brand) {
        validData.brand = await this.service.getBrandId(validData.brand);
      }

      if (validData.supplier) {
        validData.supplier = await this.service.getSupplierId(validData.supplier);
      }

      if (validData.category) {
        validData.category = await this.service.getCategoryId(validData.category);
      }

      let data = await this.service?.update(req.params.id, validData);
      if (!data._id) return this.error({ res, message: 'Invalid data!' });

      // Enhanced image handling for multiple sources (multer files or base64)
      if (req.file || req.files || req.base64File || req.base64Files || this.service.hasField('images')) {
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

      const resource = (await this.resource?.make(data)) || data;
      this.success({ res, message: 'Data updated!', resource });
    } catch (error) {
      return this.error({ res, message: error.message });
    }
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
