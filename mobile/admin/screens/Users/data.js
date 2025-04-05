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
        // Add populate parameter to ensure the info reference is populated
        const response = await api.get(`/api/v1/users/${userId}?populate=info`);
        
        if (response.data && response.data.resource) {
            const user = response.data.resource;
            
            // If it's an array, take the first item (should be only one)
            const userData = Array.isArray(user) ? user[0] : user;
            
            console.log("Raw user data from API:", JSON.stringify(userData, null, 2));
            
            // Make sure we have the user ID
            const formattedUser = {
                ...userData,
                id: userData.id || userData._id,
            };
            
            // Special handling for the info object based on the API response
            // Check if info is an ObjectID reference or a populated object
            if (userData.info) {
                // If info is already a populated object with the properties we need
                if (typeof userData.info === 'object' && userData.info.first_name) {
                    formattedUser.info = { ...userData.info };
                    console.log("Info is already populated with fields:", Object.keys(userData.info));
                } 
                // If info is just a string ID, we need to make an additional request
                else if (typeof userData.info === 'string' || (typeof userData.info === 'object' && userData.info._id)) {
                    const infoId = typeof userData.info === 'string' ? userData.info : userData.info._id;
                    console.log(`Info is not populated, fetching info with ID: ${infoId}`);
                    
                    try {
                        // Make an additional request to get the user info
                        const infoResponse = await api.get(`/api/v1/user-info/${infoId}`);
                        if (infoResponse.data && infoResponse.data.resource) {
                            const infoData = infoResponse.data.resource;
                            formattedUser.info = typeof infoData === 'object' ? 
                                infoData : 
                                (Array.isArray(infoData) && infoData.length > 0 ? infoData[0] : {});
                            console.log("Successfully fetched user info:", Object.keys(formattedUser.info));
                        }
                    } catch (error) {
                        console.error("Failed to fetch user info:", error);
                        formattedUser.info = { _id: infoId };
                    }
                }
            } else {
                // If info is missing, initialize an empty object
                formattedUser.info = {};
            }
            
            console.log("Formatted user for form:", JSON.stringify(formattedUser, null, 2));
            return formattedUser;
        }
        
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};
