import * as changeCase from "change-case";
import resourceBuilder from '../base/resource.js';
import apiSlice from './index';
import { resources, addResource } from '../constants/resources';
import { addTagType } from './index';

const customEndpoints = {
    // TODO: Notifications custom endpoints


    // TODO: Reviews custom endpoints
    reviews: (builder) => ({
        getAllReviews: builder.mutation({
            query: (qStr = '') => ({
                url: `/reviews${qStr ? `?${qStr}` : ''}`,
                method: 'GET',
            }),
        }),
        getReviewById: builder.mutation({
            query: ({ id, qStr = '' }) => ({
                url: `/reviews/${id}${qStr ? `?${qStr}` : ''}`,
                method: 'GET',
            }),
        }),
        storeReview: builder.mutation({
            query: (data) => {
                return {
                    url: `/reviews`,
                    method: 'POST',
                    body: data,
                    formData: true,
                };
            },
        }),
        updateReview: builder.mutation({
            query: ({ id, data }) => ({
                url: `/reviews/${id}`,
                method: 'PATCH',
                body: data,
                formData: true,
            }),
        }),
        deleteReview: builder.mutation({
            query: (id) => ({
                url: `/reviews/${id}`,
                method: 'DELETE',
            }),
        }),
    }),

    // Products custom endpoints
    products: (builder) => ({
        searchProducts: builder.mutation({
            query: (queryParams = {}) => {
                const { query, category, priceRange, filter, page = 1, limit = 10 } = queryParams;
                let queryString = `?page=${page}&limit=${limit}`;

                if (query) queryString += `&name[$regex]=${query}&name[$options]=i`;
                if (category) queryString += `&category=${category}`;

                if (priceRange && priceRange.length === 2) {
                    queryString += `&price[$gte]=${priceRange[0]}&price[$lte]=${priceRange[1]}`;
                }

                if (filter === 'Newest') queryString += '&sort=-createdAt';
                else if (filter === 'Popular') queryString += '&sort=-averageRating';
                else if (filter === 'Sale') queryString += '&discount=true';

                return {
                    url: `/products${queryString}`,
                    method: 'GET',
                };
            },
            invalidatesTags: [{ type: 'PRODUCTS', id: 'SEARCH' }]
        }),

        filterProducts: builder.mutation({
            query: (filters) => ({
                url: '/products/filter',
                method: 'POST',
                body: filters
            }),
            invalidatesTags: [{ type: 'PRODUCTS', id: 'FILTER' }]
        }),
    }),

    // TODO: Orders custom endpoints


    // Cart custom endpoints
    cart: (builder) => ({
        clearCart: builder.mutation({
            query: () => ({
                url: 'cart/clear',
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'CART', id: 'LIST' }]
        }),
        updateCartQuantity: builder.mutation({
            query: (data) => ({
                url: `cart/edit/${data.id}`,
                method: 'PATCH',
                body: { quantity: data.quantity },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'CART', id },
                { type: 'CART', id: 'LIST' }
            ]
        }),
    }),
};

// Create a combined endpoints object with all resource endpoints
let resourceEndpoints = {};

// Inject endpoints for each resource
resources.forEach(resource => {
    const name = changeCase.camelCase(resource);
    const customEndpointsForResource = customEndpoints[name] || (() => ({}));

    const injectedEndpoints = apiSlice.injectEndpoints({
        endpoints: resourceBuilder(resource, customEndpointsForResource),
        overrideExisting: false,
    });
    resourceEndpoints = { ...resourceEndpoints, ...injectedEndpoints };
});

// Export a helper function to create new resource endpoints on the fly
export const createResourceEndpoint = (resource) => {
    addResource(resource);
    addTagType(resource.toUpperCase());

    const name = changeCase.camelCase(resource);
    const customEndpointsForResource = customEndpoints[name] || (() => ({}));

    const injectedEndpoints = apiSlice.injectEndpoints({
        endpoints: resourceBuilder(resource, customEndpointsForResource),
        overrideExisting: false,
    });

    resourceEndpoints = { ...resourceEndpoints, ...injectedEndpoints };
    return injectedEndpoints;
};

export default resourceEndpoints;