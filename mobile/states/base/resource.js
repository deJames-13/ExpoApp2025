import * as changeCase from "change-case";

export default function resourceBuilder(resource, customEndpoints = (builder) => ({})) {
    let name = changeCase.camelCase(resource);
    let capitalizedName = changeCase.pascalCase(resource);

    const TAG_TYPE = resource.toUpperCase();

    return (builder) => ({
        [`get${capitalizedName}List`]: builder.mutation({
            query: (qStr) => ({
                url: `${resource}${qStr ? `?${qStr}` : ''}`,
                method: 'GET',
            }),
            providesTags: (result) =>
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
            providesTags: (result, error, id) => [{ type: TAG_TYPE, id }]
        }),
        [`create${capitalizedName}`]: builder.mutation({
            query: (data) => ({
                url: `${resource}/`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: [{ type: TAG_TYPE, id: 'LIST' }]
        }),
        [`update${capitalizedName}`]: builder.mutation({
            query: ({ id, data }) => ({
                url: `${resource}/${id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: TAG_TYPE, id },
                { type: TAG_TYPE, id: 'LIST' }
            ]
        }),
        [`delete${capitalizedName}`]: builder.mutation({
            query: (id) => ({
                url: `${resource}/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: TAG_TYPE, id },
                { type: TAG_TYPE, id: 'LIST' }
            ]
        }),
        ...customEndpoints(builder),
    });
}