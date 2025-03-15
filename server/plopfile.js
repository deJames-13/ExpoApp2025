export default function (plop) {
    // Add helpers for modifying the route index file
    plop.setHelper('toLowerCase', (text) => text.toLowerCase());

    // controller generator
    plop.setGenerator('controller', {
        description: 'application controller logic',
        prompts: [{
            type: 'input',
            name: 'name',
            message: 'controller name please'
        }],
        actions: [
            {
                type: 'add',
                path: 'controllers/{{camelCase name}}.controller.js',
                templateFile: 'generators/controller.hbs'
            },
            {
                type: 'modify',
                path: 'controllers/index.js',
                pattern: /(export {)/,
                template: 'export { default as {{pascalCase name}}Controller } from \'./{{camelCase name}}.controller.js\';\n$1'
            }
        ]
    });

    // model generator
    plop.setGenerator('model', {
        description: 'application model logic',
        prompts: [{
            type: 'input',
            name: 'name',
            message: 'model name please'
        }],
        actions: [
            {
                type: 'add',
                path: 'models/{{camelCase name}}.model.js',
                templateFile: 'generators/model.hbs'
            },
            {
                type: 'modify',
                path: 'models/index.js',
                pattern: /(export {)/,
                template: 'export { default as {{pascalCase name}} } from \'./{{camelCase name}}.model.js\';\n$1'
            }
        ]
    });

    // service generator
    plop.setGenerator('service', {
        description: 'application service logic',
        prompts: [{
            type: 'input',
            name: 'name',
            message: 'service name please'
        }],
        actions: [
            {
                type: 'add',
                path: 'services/{{camelCase name}}.service.js',
                templateFile: 'generators/service.hbs'
            },
            {
                type: 'modify',
                path: 'services/index.js',
                pattern: /(export {)/,
                template: 'export { default as {{pascalCase name}}Service } from \'./{{camelCase name}}.service.js\';\n$1'
            }
        ]
    });

    // resource generator
    plop.setGenerator('resource', {
        description: 'application resource logic',
        prompts: [{
            type: 'input',
            name: 'name',
            message: 'resource name please'
        }],
        actions: [
            {
                type: 'add',
                path: 'resources/{{camelCase name}}.resource.js',
                templateFile: 'generators/resource.hbs'
            },
            {
                type: 'modify',
                path: 'resources/index.js',
                pattern: /(export {)/,
                template: 'export { default as {{pascalCase name}}Resource } from \'./{{camelCase name}}.resource.js\';\n$1'
            }
        ]
    });

    // validation generator
    plop.setGenerator('validation', {
        description: 'application validation logic',
        prompts: [{
            type: 'input',
            name: 'name',
            message: 'validation name please'
        }],
        actions: [
            {
                type: 'add',
                path: 'validations/{{camelCase name}}.validation.js',
                templateFile: 'generators/validation.hbs'
            },
            {
                type: 'modify',
                path: 'validations/index.js',
                pattern: /(export {)/,
                template: 'export { default as {{camelCase name}}Rules } from \'./{{camelCase name}}.validation.js\';\n$1'
            }
        ]
    });

    // route generator
    plop.setGenerator('route', {
        description: 'application route logic',
        prompts: [{
            type: 'input',
            name: 'name',
            message: 'route name please'
        }],
        actions: [
            {
                type: 'add',
                path: 'routes/v1/{{camelCase name}}.routes.js',
                templateFile: 'generators/route.hbs'
            },
            {
                type: 'modify',
                path: 'routes/v1/index.js',
                pattern: /(import.*from.*;\n)/,
                template: '$1import {{camelCase name}}Routes from \'./{{camelCase name}}.routes.js\';\n'
            },
            {
                type: 'modify',
                path: 'routes/v1/index.js',
                pattern: /(const v1 = \[)/,
                template: '$1\n  {\n    url: \'/{{toLowerCase name}}s\',\n    router: {{camelCase name}}Routes,\n  },'
            }
        ]
    });

    // api generator (creates controller, model, resource, and route)
    plop.setGenerator('api', {
        description: 'generate complete API components',
        prompts: [{
            type: 'input',
            name: 'name',
            message: 'API name please'
        }],
        actions: [
            // Create model
            {
                type: 'add',
                path: 'models/{{camelCase name}}.model.js',
                templateFile: 'generators/model.hbs'
            },
            {
                type: 'modify',
                path: 'models/index.js',
                pattern: /(export {)/,
                template: 'export { default as {{pascalCase name}} } from \'./{{camelCase name}}.model.js\';\n$1'
            },

            // Create service
            {
                type: 'add',
                path: 'services/{{camelCase name}}.service.js',
                templateFile: 'generators/service.hbs'
            },
            {
                type: 'modify',
                path: 'services/index.js',
                pattern: /(export {)/,
                template: 'export { default as {{pascalCase name}}Service } from \'./{{camelCase name}}.service.js\';\n$1'
            },

            // Create resource
            {
                type: 'add',
                path: 'resources/{{camelCase name}}.resource.js',
                templateFile: 'generators/resource.hbs'
            },
            {
                type: 'modify',
                path: 'resources/index.js',
                pattern: /(export {)/,
                template: 'export { default as {{pascalCase name}}Resource } from \'./{{camelCase name}}.resource.js\';\n$1'
            },

            // Create validation
            {
                type: 'add',
                path: 'validations/{{camelCase name}}.validation.js',
                templateFile: 'generators/validation.hbs'
            },
            {
                type: 'modify',
                path: 'validations/index.js',
                pattern: /(export {)/,
                template: 'export { default as {{camelCase name}}Rules } from \'./{{camelCase name}}.validation.js\';\n$1'
            },

            // Create controller
            {
                type: 'add',
                path: 'controllers/{{camelCase name}}.controller.js',
                templateFile: 'generators/controller.hbs'
            },
            {
                type: 'modify',
                path: 'controllers/index.js',
                pattern: /(export {)/,
                template: 'export { default as {{pascalCase name}}Controller } from \'./{{camelCase name}}.controller.js\';\n$1'
            },

            // Create route
            {
                type: 'add',
                path: 'routes/v1/{{camelCase name}}.routes.js',
                templateFile: 'generators/route.hbs'
            },
            {
                type: 'modify',
                path: 'routes/v1/index.js',
                pattern: /(import.*from.*;\n)/,
                template: '$1import {{camelCase name}}Routes from \'./{{camelCase name}}.routes.js\';\n'
            },
            {
                type: 'modify',
                path: 'routes/v1/index.js',
                pattern: /(const v1 = \[)/,
                template: '$1\n  {\n    url: \'/{{toLowerCase name}}s\',\n    router: {{camelCase name}}Routes,\n  },'
            }
        ]
    });
};