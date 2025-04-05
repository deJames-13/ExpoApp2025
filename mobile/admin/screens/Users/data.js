import api from "~/screens/Home/api";

// Initial empty array for users
export const usersData = [];

// Function to fetch users from the backend with pagination
export const fetchUsers = async (page = 1, limit = 10, search = '', sort = {}) => {
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

        const response = await api.get(`/api/v1/users?${params.toString()}`);

        // Check if the response has the expected structure
        if (response.data && response.data.resource) {
            // Get meta info from the server response
            const metaData = response.data.meta || {};

            // Create standardized pagination object with server meta
            const pagination = {
                total: metaData.total || response.data.resource.length,
                page: metaData.page || page,
                limit: metaData.limit || limit,
                pages: metaData.last_page || Math.ceil((metaData.total || response.data.resource.length) / limit),
                last_page: metaData.last_page || Math.ceil((metaData.total || response.data.resource.length) / limit)
            };

            // Format users to ensure info is an object, not a string reference
            const users = response.data.resource.map(user => ({
                ...user,
                id: user.id || user._id, // Ensure id is available
                // Format info correctly if it's a string or missing
                info: user.info ?
                    (typeof user.info === 'string' ? { _id: user.info } : user.info) :
                    {}
            }));

            return { users, pagination };
        } else {
            console.warn('Unexpected API response format:', response.data);
            return {
                users: [],
                pagination: { total: 0, page, limit, pages: 0, last_page: 0 }
            };
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        return {
            users: [],
            pagination: { total: 0, page, limit, pages: 0, last_page: 0 },
            error: error.message
        };
    }
};

// Function to create a new user
export const createUser = async (userData) => {
    try {
        const response = await api.post('/api/v1/users', userData);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Function to update a user
export const updateUser = async (userId, userData) => {
    try {
        const response = await api.put(`/api/v1/users/edit/${userId}`, userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// Function to delete a user
export const deleteUser = async (userId) => {
    try {
        const response = await api.delete(`/api/v1/users/delete/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

// Function to get a single user by ID
export const getUserById = async (userId) => {
    try {
        const response = await api.get(`/api/v1/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};
