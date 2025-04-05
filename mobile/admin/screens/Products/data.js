import api from '~/axios.config';
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

/**
 * Utility function to properly format product IDs for API requests
 */
export const formatProductId = (product) => {
  if (!product) return null;
  
  // If product is a string, assume it's already an ID
  if (typeof product === 'string') return product;
  
  // Based on your API response, 'id' is the primary ID field
  // Prioritize this field as shown in your API response example
  const id = product.id || product._id || product.resource?.id || product.resource?._id;
  
  if (!id) {
    console.error('Could not find ID in product:', product);
    return null;
  }
  
  return id; // Return the ID without encoding to preserve MongoDB ObjectId format
};

/**
 * Update a product with enhanced error handling and debugging
 */
export const updateProduct = async (product, updateData, options = {}) => {
  try {
    if (!product) throw new Error('No product provided for update');
    
    // Get the product ID from the product object
    const productId = product.id || formatProductId(product);
    
    if (!productId) throw new Error('Invalid product ID for update');
    
    console.log(`Updating product ${productId} with data:`, updateData);
    
    const config = await getAuthConfig();
    
    // If we have form data, adjust headers
    if (options.formData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    
    // Based on your confirmed working endpoint format
    const primaryEndpoint = `/api/v1/products/edit/${productId}`;
    
    // Ensure brand, category, and supplier are sent as strings (not objects)
    const processedData = { ...updateData };
    
    // Process brand if it exists
    if (processedData.brand && typeof processedData.brand === 'object') {
      processedData.brand = processedData.brand.name || processedData.brand.label || '';
      console.log('Processed brand for update:', processedData.brand);
    }
    
    // Process category if it exists
    if (processedData.category && typeof processedData.category === 'object') {
      processedData.category = processedData.category.name || processedData.category.label || '';
      console.log('Processed category for update:', processedData.category);
    }
    
    // Process supplier if it exists
    if (processedData.supplier && typeof processedData.supplier === 'object') {
      processedData.supplier = processedData.supplier.name || processedData.supplier.label || '';
      console.log('Processed supplier for update:', processedData.supplier);
    }
    
    try {
      console.log(`Sending update to: ${primaryEndpoint}`);
      
      const dataToSend = options.formData || processedData;
      console.log('Data being sent:', dataToSend);
      
      const response = await api.patch(primaryEndpoint, dataToSend, config);
      console.log('Update succeeded!');
      return response.data;
    } catch (error) {
      console.error(`Update failed:`, error.message);
      
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      
      throw error;
    }
  } catch (error) {
    console.error('Error in updateProduct function:', error);
    throw error;
  }
};

/**
 * Enhanced debug function to test API endpoints and diagnose issues
 */
export const debugProductId = async (productId) => {
  try {
    const config = await getAuthConfig();
    console.log('=== DEBUG PRODUCT ID START ===');
    console.log(`Testing if product ID is valid: ${productId}`);
    console.log(`API base URL: ${api.defaults.baseURL || 'Not set'}`);
    
    // Check if ID is in correct format
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(productId);
    console.log(`Is MongoDB ObjectId format: ${isMongoId}`);
    
    // Test different endpoint styles
    const endpoints = [
      `/api/v1/products/${productId}`,
      `api/v1/products/${productId}`,
      `/products/${productId}`,
      `/api/products/${productId}`
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying GET: ${endpoint}`);
        const response = await api.get(endpoint, config);
        console.log(`Success with ${endpoint}:`);
        console.log(`  Status: ${response.status}`);
        console.log(`  Has data: ${!!response.data}`);
        console.log(`  Response type: ${typeof response.data}`);
        if (response.data) {
          console.log(`  Product name: ${response.data.name || response.data.resource?.name || 'N/A'}`);
        }
      } catch (error) {
        console.error(`Failed with ${endpoint}:`);
        console.error(`  Error: ${error.message}`);
        if (error.response) {
          console.error(`  Status: ${error.response.status}`);
          console.error(`  Response: ${JSON.stringify(error.response.data)}`);
        }
      }
    }
    
    console.log('=== DEBUG PRODUCT ID END ===');
  } catch (error) {
    console.error('Debug error:', error);
  }
};

/**
 * Debug function to test API endpoints
 */
export const testProductEndpoint = async (productId) => {
  try {
    const config = await getAuthConfig();
    console.log(`Testing endpoint for product ${productId}...`);
    
    // Try to fetch the product to verify the endpoint works
    const response = await api.get(`/api/v1/products/${productId}`, config);
    console.log('Product fetch successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error testing product endpoint:', error);
    throw error;
  }
};

// Function to fetch a single product by ID
export const fetchProductById = async (productId) => {
  try {
    const config = await getAuthConfig();
    const response = await api.get(`/api/v1/products/${productId}`, config);
    
    if (response.data && response.data.resource) {
      // Format the product data consistently
      const product = response.data.resource;
      return {
        ...product,
        price: product.price ? parseFloat(product.price) : 0,
        // Make sure we have consistent object structure
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
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
};
