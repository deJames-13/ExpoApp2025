import * as changeCase from "change-case";

export default function resourceBuilder(resource, customEndpoints = (builder) => ({})) {
    let name = changeCase.camelCase(resource);
    let capitalizedName = changeCase.pascalCase(resource);

    const TAG_TYPE = resource.toUpperCase();

    return (builder) => ({
        [`getAll${capitalizedName}`]: builder.mutation({
            query: (qStr) => ({
                url: `${resource}${qStr ? `?${qStr}` : ''}`,
                method: 'GET',
            }),
            invalidatesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: TAG_TYPE, id })),
                        { type: TAG_TYPE, id: 'LIST' }
                    ]
                    : [{ type: TAG_TYPE, id: 'LIST' }]
        }),
        [`get${capitalizedName}ById`]: builder.mutation({
            query: ({ id, qStr }) => ({
                url: `${resource}/${id}${qStr ? `?${qStr}` : ''}`,
                method: 'GET',
            }),
            invalidatesTags: (result, error, { id }) => [{ type: TAG_TYPE, id }]
        }),
        [`get${capitalizedName}BySlug`]: builder.mutation({
            query: ({ slug, qStr }) => ({
                url: `${resource}/${slug}${qStr ? `?${qStr}` : ''}`,
                method: 'GET',
            }),
            invalidatesTags: (result, error, { slug }) => result ? [{ type: TAG_TYPE, id: result.id }] : []
        }),
        [`store${capitalizedName}`]: builder.mutation({
            query: (payload) => {
                // If payload is not an object with options, treat it as just data
                const isOptionsObject = typeof payload === 'object' && payload.hasOwnProperty('data');
                const data = isOptionsObject ? payload.data : payload;
                const qStr = isOptionsObject && payload.qStr ? `?${payload.qStr}` : '';
                const headers = isOptionsObject && payload.headers ? payload.headers : undefined;
                const method = isOptionsObject && payload.method ? payload.method : 'POST';

                return {
                    url: `${resource}/${qStr}`,
                    method,
                    body: data,
                    headers,
                    ...(isOptionsObject && payload.options)
                };
            },
            invalidatesTags: [{ type: TAG_TYPE, id: 'LIST' }]
        }),
        [`update${capitalizedName}`]: builder.mutation({
            query: (payload) => {
                const id = payload.id;
                const data = payload.data;
                const qStr = payload.qStr ? `?${payload.qStr}` : '';
                const headers = payload.headers;
                const method = payload.method || 'PATCH';

                return {
                    url: `${resource}/${id}${qStr}`,
                    method,
                    body: data,
                    headers,
                    ...(payload.options)
                };
            },
            invalidatesTags: (result, error, { id }) => [
                { type: TAG_TYPE, id },
                { type: TAG_TYPE, id: 'LIST' }
            ]
        }),
        [`delete${capitalizedName}`]: builder.mutation({
            query: (payload) => {
                // Handle both simple ID case and options object
                const isOptionsObject = typeof payload === 'object' && !Array.isArray(payload);
                const id = isOptionsObject ? payload.id : payload;
                const qStr = isOptionsObject && payload.qStr ? `?${payload.qStr}` : '';
                const headers = isOptionsObject && payload.headers ? payload.headers : undefined;
                const method = isOptionsObject && payload.method ? payload.method : 'DELETE';

                return {
                    url: `${resource}/${id}${qStr}`,
                    method,
                    headers,
                    ...(isOptionsObject && payload.options)
                };
            },
            invalidatesTags: (result, error, payload) => {
                const id = typeof payload === 'object' ? payload.id : payload;
                return [
                    { type: TAG_TYPE, id },
                    { type: TAG_TYPE, id: 'LIST' }
                ];
            }
        }),
        ...customEndpoints(builder),
    });
}