import * as changeCase from "change-case";
import resourceBuilder from '../base/resource.js';
import { apiSlice } from './index';

const resources = [
    'users',
    'products',
    'categories',
    'orders',
    'cart',
    'notifications',
    'reviews',
];

const customEndpoints = {
    // TODO: Notifications custom endpoints


    // TODO: Reviews custom endpoints


    // TODO: Orders custom endpoints


    // TODO: Cart custom endpoints

}

const resourceEndpoints = resources.reduce((acc, resource) => {
    let name = changeCase.camelCase(resource);

    return apiSlice.injectEndpoints({
        endpoints: resourceBuilder(resource, customEndpoints[name]),
    });
}, {});

export default resourceEndpoints;