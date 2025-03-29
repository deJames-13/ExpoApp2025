import * as changeCase from "change-case";
import resourceBuilder from '../base/resource.js';
import apiSlice from './index';
import { resources, addResource } from '../constants/resources';
import { addTagType } from './index';

const customEndpoints = {
    // TODO: Notifications custom endpoints


    // TODO: Reviews custom endpoints


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