import api from "~/screens/Home/api";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial empty array for products
export const productsData = [];

// Helper function to get auth config
const getAuthConfig = async () => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    return {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    };
  } catch (error) {
    console.error('Error getting auth config:', error);
    return { headers: { 'Content-Type': 'application/json' } };
  }
};

// Function to fetch products from the backend
export const fetchProducts = async (limit = 100) => {
  try {
    const config = await getAuthConfig();
    // Add pagination parameters to request a larger number of products
    const response = await api.get(`/api/v1/products?limit=${limit}&page=1`, config);
    
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
    const config = await getAuthConfig();
    const response = await api.get('/api/v1/brands', config);
    if (response.data && (Array.isArray(response.data.resource) || Array.isArray(response.data))) {
      const brands = Array.isArray(response.data.resource) ? response.data.resource : response.data;
      // Format the data for dropdowns - using name for both label and ID for value
      return brands.map(brand => ({
        label: brand.name || 'Unnamed Brand',
        value: brand._id || brand.id || '',
        // Include the original object for reference if needed
        data: brand
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
    const config = await getAuthConfig();
    const response = await api.get('/api/v1/categories', config);
    if (response.data && (Array.isArray(response.data.resource) || Array.isArray(response.data))) {
      const categories = Array.isArray(response.data.resource) ? response.data.resource : response.data;
      // Format the data for dropdowns - using name for both label and ID for value
      return categories.map(category => ({
        label: category.name || 'Unnamed Category',
        value: category._id || category.id || '',
        // Include the original object for reference if needed
        data: category
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
    const config = await getAuthConfig();
    const response = await api.get('/api/v1/suppliers', config);
    if (response.data && (Array.isArray(response.data.resource) || Array.isArray(response.data))) {
      const suppliers = Array.isArray(response.data.resource) ? response.data.resource : response.data;
      // Format the data for dropdowns - using name for both label and ID for value
      return suppliers.map(supplier => ({
        label: supplier.name || 'Unnamed Supplier',
        value: supplier._id || supplier.id || '',
        // Include the original object for reference if needed
        data: supplier
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return [];
  }
};
