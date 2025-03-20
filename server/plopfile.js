import { camelCase, kebabCase } from "change-case";
import pluralize from "pluralize";

export default function (plop) {
    // Helper to capitalize first letter while preserving the rest
    plop.setHelper('capitalize', (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    });

    // Feature generator
    plop.setGenerator('feature', {
        description: 'Create a new feature module',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Feature name (singular):',
                validate: (value) => {
                    if (/.+/.test(value)) {
                        return true;
                    }
                    return 'Feature name is required';
                },
            },
            {
                type: 'confirm',
                name: 'addToMainIndex',
                message: 'Add this feature to the main features index.js file?',
                default: true
            },
            {
                type: 'confirm',
                name: 'addToRoutes',
                message: 'Add this feature routes to the v1.js routes file?',
                default: true
            }
        ],
        actions: function (data) {
            // Convert the input name to kebab case using change-case
            data.name = kebabCase(data.name);
            // Create camelCase version of the name using change-case
            data.camelName = camelCase(data.name);

            const actions = [];

            // Files to generate
            const files = [
                'model.js',
                'service.js',
                'resource.js',
                'validation.js',
                'controller.js',
                'routes.js'
            ];

            // Transform template function to replace all references
            const transformTemplate = (template, data) => {
                const camelCaseName = data.camelName;
                const capitalizedName = plop.getHelper('capitalize')(camelCaseName);
                const pluralName = pluralize(camelCaseName);

                // Replace _Example with capitalized camelCase name
                let result = template.replace(/_Example/g, capitalizedName);

                // Replace _example with camelCase name
                result = result.replace(/_example/g, camelCaseName);

                // Replace _examples with pluralized camelCase name
                result = result.replace(/_examples/g, pluralName);

                return result;
            };

            // Create an action for each file
            files.forEach(file => {
                actions.push({
                    type: 'add',
                    path: `features/{{name}}/{{name}}.${file}`,
                    templateFile: `features/_examples/_example.${file}`,
                    transform: (template, data) => transformTemplate(template, data)
                });
            });

            // Create index.js file that exports all modules
            actions.push({
                type: 'add',
                path: `features/{{name}}/index.js`,
                template: `// filepath: features/{{name}}/index.js
export { default as {{capitalize camelName}}Controller } from './{{name}}.controller.js';
export { default as {{capitalize camelName}}Model } from './{{name}}.model.js';
export { default as {{capitalize camelName}}Resource } from './{{name}}.resource.js';
export { default as {{camelName}}Routes } from './{{name}}.routes.js';
export { default as {{capitalize camelName}}Service } from './{{name}}.service.js';
export * from './{{name}}.validation.js';
`
            });

            // Add to main features index.js if requested - target the specific comment
            if (data.addToMainIndex) {
                actions.push({
                    type: 'modify',
                    path: 'features/index.js',
                    pattern: /\/\/ new-feature-import ->/g,
                    template: `// new-feature-import ->\nexport * from './{{name}}/index.js';`,
                });
            }

            // Add to routes v1.js if requested - target the specific comment
            if (data.addToRoutes) {
                actions.push({
                    type: 'modify',
                    path: 'routes/v1.js',
                    pattern: /\/\/ NEW ROUTE HERE ->/g,
                    template: `// NEW ROUTE HERE ->\n  ...features.{{camelName}}Routes,`,
                });
            }

            return actions;
        }
    });
}
