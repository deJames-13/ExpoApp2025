import api from "~/screens/Home/api";

// Initial empty array for products
export const productsData = [];

// Function to fetch products from the backend
export const fetchProducts = async () => {
  try {
    const response = await api.get('/api/v1/products');
    
    // Check if the response has the expected structure with resource field
    if (response.data && Array.isArray(response.data.resource)) {
      // Format the response to match expected structure
      return response.data.resource.map(product => ({
        ...product,
        // Convert price from string to number
        price: product.price ? parseFloat(product.price) : 0,
        // Convert string values to object format for compatibility with existing code
        category: typeof product.category === 'string' 
          ? { _id: product.id, name: product.category } 
          : product.category,
        brand: typeof product.brand === 'string'
          ? { _id: product.id, name: product.brand }
          : product.brand,
        supplier: product.supplier 
          ? (typeof product.supplier === 'string' 
              ? { _id: product.id, name: product.supplier } 
              : product.supplier)
          : { _id: null, name: 'Unknown' }
      }));
    } else if (response.data && Array.isArray(response.data)) {
      return response.data.map(product => ({
        ...product,
        price: product.price ? parseFloat(product.price) : 0,
      }));
    } else {
      console.warn('Unexpected API response format:', response.data);
      return []; // Return empty array as fallback
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Function to fetch brands from the backend
export const fetchBrands = async () => {
  try {
    const response = await api.get('/api/v1/brands');
    if (response.data && (Array.isArray(response.data.resource) || Array.isArray(response.data))) {
      const brands = Array.isArray(response.data.resource) ? response.data.resource : response.data;
      // Make sure we're returning in the format expected by the dropdown
      return brands.map(brand => ({
        label: brand.name || 'Unnamed Brand',
        value: brand._id || brand.id || ''
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
};

// Function to fetch categories from the backend
export const fetchCategories = async () => {
  try {
    const response = await api.get('/api/v1/categories');
    if (response.data && (Array.isArray(response.data.resource) || Array.isArray(response.data))) {
      const categories = Array.isArray(response.data.resource) ? response.data.resource : response.data;
      // Make sure we're returning in the format expected by the dropdown
      return categories.map(category => ({
        label: category.name || 'Unnamed Category',
        value: category._id || category.id || ''
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Function to fetch suppliers from the backend
export const fetchSuppliers = async () => {
  try {
    const response = await api.get('/api/v1/suppliers');
    if (response.data && (Array.isArray(response.data.resource) || Array.isArray(response.data))) {
      const suppliers = Array.isArray(response.data.resource) ? response.data.resource : response.data;
      // Make sure we're returning in the format expected by the dropdown
      return suppliers.map(supplier => ({
        label: supplier.name || 'Unnamed Supplier',
        value: supplier._id || supplier.id || ''
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return [];
  }
};
