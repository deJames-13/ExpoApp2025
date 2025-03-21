import { checkHealth } from './health.controller.js';

export const healthRoutes = [
    {
        url: '/health',
        router: [
            {
                path: '/',
                method: 'get',
                controller: checkHealth
            }
        ]
    }
];
