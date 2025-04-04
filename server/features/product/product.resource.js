import { BrandModel, CategoryModel, ReviewModel, SupplierModel } from '#features';
import { Resource } from '#lib';

export default class ProductResource extends Resource {
  // Override the toArray method to safely handle data without toJSON method
  async toArray() {
    if (Array.isArray(this.data)) {
      return await Promise.all(
        this.data.map(async (item) => {
          // Safely handle items that may not have toJSON
          const itemData = item?.toJSON ? item.toJSON() : item;
          return await this.transform(itemData);
        })
      );
    }
    // Handle single item case
    const itemData = this.data?.toJSON ? this.data.toJSON() : this.data;
    return await this.transform(itemData);
  }

  async transform(product) {
    if (!product?._id) return null;

    const {
      _id,
      category,
      brand,
      supplier,
      reviews,
      categoryDetails,
      brandDetails,
      ...rest
    } = product;

    // If data comes from aggregation, it might already have details populated
    let categoryInfo = categoryDetails ? {
      name: categoryDetails.name,
      _id: categoryDetails._id
    } : null;

    let brandInfo = brandDetails ? {
      name: brandDetails.name,
      _id: brandDetails._id
    } : null;

    let supplierInfo = null;

    // Fetch details only if not already present and IDs exist
    if (!categoryInfo && category) {
      categoryInfo = await CategoryModel.findById(category).select('name _id');
    }

    if (!brandInfo && brand) {
      brandInfo = await BrandModel.findById(brand).select('name _id');
    }

    if (supplier) {
      supplierInfo = await SupplierModel.findById(supplier).select('name _id');
    }

    // Handle reviews data
    let averageRating = rest.averageRating;
    let numOfReviews = reviews?.length || 0;

    // Calculate average rating only if not already available
    if (reviews?.length && !averageRating) {
      const reviewsData = await ReviewModel.find({ _id: { $in: reviews } }).select('rating');
      averageRating = reviewsData.length > 0
        ? reviewsData.reduce((acc, review) => acc + review.rating, 0) / reviewsData.length
        : 0;
    }

    return {
      ...rest,
      id: _id,
      category: categoryInfo ? categoryInfo.name : null,
      brand: brandInfo ? brandInfo.name : null,
      supplier: supplierInfo ? supplierInfo.name : null,
      numOfReviews,
      averageRating: parseFloat(averageRating || 0),
      price: typeof rest.price === 'number' ? rest.price.toFixed(2) : rest.price,
      stock: parseInt(rest.stock || 0),
    };
  }
}
