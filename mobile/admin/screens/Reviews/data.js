import api from "~/screens/Home/api";

// Initial empty array for reviews
export const reviewsData = [];

// Function to fetch reviews from the backend with pagination
export const fetchReviews = async (page = 1, limit = 10, search = '', sort = {}) => {
    try {
        // Build query parameters for pagination and sorting
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);

        if (search) params.append('search', search);

        if (sort.field) {
            // Convert direction to sort order (1 for asc, -1 for desc)
            const order = sort.direction === 'desc' ? -1 : 1;
            params.append('sort', JSON.stringify({ [sort.field]: order }));
        }

        const response = await api.get(`/api/v1/reviews?${params.toString()}`);

        // Check if the response has the expected structure
        if (response.data && response.data.resource) {
            // Get pagination meta from server response
            const metaData = response.data.meta || {};

            // Create standardized pagination object using server meta
            const pagination = {
                total: metaData.total || response.data.resource.length,
                page: metaData.page || page,
                limit: metaData.limit || limit,
                pages: metaData.last_page || Math.ceil((metaData.total || response.data.resource.length) / limit),
                last_page: metaData.last_page || Math.ceil((metaData.total || response.data.resource.length) / limit)
            };

            // Format reviews for consistency
            const reviews = response.data.resource.map(review => ({
                ...review,
                id: review.id || review._id, // Ensure id is available
            }));

            return { reviews, pagination };
        } else if (response.data && Array.isArray(response.data)) {
            return {
                reviews: response.data,
                pagination: {
                    total: response.data.length,
                    page,
                    limit,
                    pages: Math.ceil(response.data.length / limit),
                    last_page: Math.ceil(response.data.length / limit)
                }
            };
        } else {
            console.warn('Unexpected API response format:', response.data);
            return {
                reviews: [],
                pagination: { total: 0, page, limit, pages: 0, last_page: 0 }
            };
        }
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return {
            reviews: [],
            pagination: { total: 0, page, limit, pages: 0, last_page: 0 },
            error: error.message
        };
    }
};

// Function to get reviews for a specific product
export const fetchProductReviews = async (productId) => {
    try {
        const response = await api.get(`/api/v1/products/${productId}/reviews`);

        if (response.data && Array.isArray(response.data.resource)) {
            return response.data.resource;
        } else if (response.data && Array.isArray(response.data)) {
            return response.data;
        } else {
            console.warn('Unexpected API response format:', response.data);
            return []; // Return empty array as fallback
        }
    } catch (error) {
        console.error(`Error fetching reviews for product ${productId}:`, error);
        return [];
    }
};

// Function to get reviews for a specific user
export const fetchUserReviews = async (userId) => {
    try {
        const response = await api.get(`/api/v1/users/${userId}/reviews`);

        if (response.data && Array.isArray(response.data.resource)) {
            return response.data.resource;
        } else if (response.data && Array.isArray(response.data)) {
            return response.data;
        } else {
            console.warn('Unexpected API response format:', response.data);
            return []; // Return empty array as fallback
        }
    } catch (error) {
        console.error(`Error fetching reviews for user ${userId}:`, error);
        return [];
    }
};

// Function to create a new review
export const createReview = async (reviewData) => {
    try {
        const response = await api.post('/api/v1/reviews', reviewData);
        return response.data;
    } catch (error) {
        console.error('Error creating review:', error);
        throw error;
    }
};

// Function to update a review
export const updateReview = async (reviewId, reviewData) => {
    try {
        const response = await api.patch(`/api/v1/reviews/edit/${reviewId}`, reviewData);
        return response.data;
    } catch (error) {
        console.error('Error updating review:', error);
        throw error;
    }
};

// Function to delete a review
export const deleteReview = async (reviewId) => {
    try {
        const response = await api.delete(`/api/v1/reviews/delete/${reviewId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting review:', error);
        throw error;
    }
};

// Function to get a single review by ID
export const getReviewById = async (reviewId) => {
    try {
        const response = await api.get(`/api/v1/reviews/${reviewId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching review:', error);
        throw error;
    }
};
