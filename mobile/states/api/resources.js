import * as changeCase from "change-case";
import resourceBuilder from '../base/resource.js';
import apiSlice from './index';
import { resources, addResource } from '../constants/resources';
import { addTagType } from './index';

const customEndpoints = {
    // TODO: Notifications custom endpoints


    // TODO: Reviews custom endpoints


    // TODO: Orders custom endpoints


    // TODO: Cart custom endpoints

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