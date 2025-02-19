import * as changeCase from "change-case";

export default function resourceBuilder(resource, customEndpoints = (builder) => ({})) {
    let name = changeCase.camelCase(resource);

    return (builder) => ({
        [`${name}Index`]: builder.mutation({
            query: (qStr) => ({
                url: `${resource}${qStr ? `?${qStr}` : ''}`,
                method: 'GET',
            })
        }),
        [`${name}Archived`]: builder.mutation({
            query: (qStr) => ({
                url: `${resource}/Archived${qStr ? `?${qStr}` : ''}`,
                method: 'GET',
            })
        }),
        [`${name}All`]: builder.mutation({
            query: (qStr) => ({
                url: `${resource}/all${qStr ? `?${qStr}` : ''}`,
                method: 'GET',
            })
        }),
        [`${name}Show`]: builder.mutation({
            query: ({ id, qStr }) => ({
                url: `${resource}/${id}${qStr ? `?${qStr}` : ''}`,
                method: 'GET',
            })
        }),
        [`${name}Store`]: builder.mutation({
            query: (data) => ({
                url: `${resource}/`,
                method: 'POST',
                body: data
            })
        }),
        [`${name}Update`]: builder.mutation({
            query: ({ id, data }) => ({
                url: `${resource}/${id}/`,
                method: 'PUT',
                body: data
            })
        }),
        [`${name}Archive`]: builder.mutation({
            query: (id) => ({
                url: `${resource}/${id}/`,
                method: 'PATCH',
            })
        }),
        [`${name}Destroy`]: builder.mutation({
            query: (id) => ({
                url: `${resource}/${id}/`,
                method: 'DELETE',
            })
        }),
        [`${name}Restore`]: builder.mutation({
            query: (id) => ({
                url: `${resource}/${id}/restore/`,
                method: 'PATCH',
            })
        }),
        ...customEndpoints(builder),
    });
}