import * as changeCase from "change-case";
import resourceBuilder from '../base/viewsets';
import { apiSlice } from './index';

const resources = [
    'users',
];

const customEndpoints = {

}

const resourceEndpoints = resources.reduce((acc, resource) => {
    let name = changeCase.camelCase(resource);

    return apiSlice.injectEndpoints({
        endpoints: resourceBuilder(resource, customEndpoints[name]),
    });
}, {});

export default resourceEndpoints;