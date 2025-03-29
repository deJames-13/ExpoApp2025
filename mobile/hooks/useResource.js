import { useCallback, useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { setResource, toggleRefresh } from '~/states/slices/resources';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

import * as changeCase from "change-case";
import resourceEndpoints from '~/states/api/resources';

// Define alert levels
const ALERT_LEVEL = {
    NONE: 0,       // No logs
    INFO: 1,       // Only console info logs
    CONSOLE: 2,    // Console errors and warnings (no UI alerts)
    UI: 3          // With UI alerts (Alert.alert)
};

// Default level - use console alerts by default
const DEFAULT_ALERT_LEVEL = ALERT_LEVEL.NONE;

/**
 * Logging utility that handles different levels of alerts
 * @param {string} title - Alert title
 * @param {string} message - Alert message
 * @param {object} options - Additional options
 * @param {number} options.level - Alert level (defaults to DEFAULT_ALERT_LEVEL)
 * @param {string} options.type - 'info', 'warn', or 'error'
 * @param {Error} options.error - Original error object (optional)
 * @param {Function} options.onOk - Callback when OK is pressed (for UI alerts)
 */
const logMessage = (title, message, options = {}) => {
    const {
        level = DEFAULT_ALERT_LEVEL,
        type = 'info',
        error = null,
        onOk = null
    } = options;

    // If level is NONE, don't log anything
    if (level === ALERT_LEVEL.NONE) return;

    // Always log to console if level > NONE
    if (type === 'error') {
        console.error(`[${title}]`, message, error || '');
    } else if (type === 'warn') {
        console.warn(`[${title}]`, message);
    } else {
        // Only log info if level >= INFO
        if (level >= ALERT_LEVEL.INFO) {
            console.info(`[${title}]`, message);
        }
    }

    if (level === ALERT_LEVEL.UI) {
        Alert.alert(
            title,
            message,
            [{ text: 'OK', onPress: onOk }]
        );
    }
};

export default function useResource(resourceName) {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    // Improved selector to handle possible missing states
    const selectResourceData = useMemo(() =>
        createSelector(
            [(state) => state.resources || { list: {}, detail: {}, refresh: false }],
            (resources) => ({
                list: resources.list[resourceName] || [],
                detail: resources.detail[resourceName] || null,
                refresh: resources.refresh
            })
        ),
        [resourceName]);

    // Use the transformed data
    const resourceData = useSelector(selectResourceData);
    const refresh = resourceData.refresh;

    // Name formats
    const camelCaseName = changeCase.camelCase(resourceName);
    const kebabCaseName = changeCase.paramCase(resourceName);
    const pascalCaseName = changeCase.pascalCase(resourceName);
    const capitalizeName = changeCase.capitalCase(resourceName);

    // Safely access mutation hooks with fallbacks
    const getAllMutation = resourceEndpoints[`useGetAll${pascalCaseName}Mutation`];
    const getByIdMutation = resourceEndpoints[`useGet${pascalCaseName}ByIdMutation`];
    const getBySlugMutation = resourceEndpoints[`useGet${pascalCaseName}BySlugMutation`];
    const createMutation = resourceEndpoints[`useStore${pascalCaseName}Mutation`];
    const updateMutation = resourceEndpoints[`useUpdate${pascalCaseName}Mutation`];
    const deleteMutation = resourceEndpoints[`useDelete${pascalCaseName}Mutation`];

    // Use the mutation hooks if they exist
    const [getAll] = getAllMutation ? getAllMutation() : [() => Promise.reject(new Error(`getAllMutation for ${resourceName} not found`))];
    const [getById] = getByIdMutation ? getByIdMutation() : [() => Promise.reject(new Error(`getByIdMutation for ${resourceName} not found`))];
    const [getBySlug] = getBySlugMutation ? getBySlugMutation() : [() => Promise.reject(new Error(`getBySlugMutation for ${resourceName} not found`))];
    const [create] = createMutation ? createMutation() : [() => Promise.reject(new Error(`createMutation for ${resourceName} not found`))];
    const [update] = updateMutation ? updateMutation() : [() => Promise.reject(new Error(`updateMutation for ${resourceName} not found`))];
    const [deleteItem] = deleteMutation ? deleteMutation() : [() => Promise.reject(new Error(`deleteMutation for ${resourceName} not found`))];

    // States
    const [data, setData] = useState(resourceData.list || []);
    const [meta, setMeta] = useState({});
    const [current, setCurrent] = useState(resourceData.detail || null);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);

    // Update local state when redux state changes
    useEffect(() => {
        if (resourceData.list && resourceData.list.length > 0) {
            setData(resourceData.list);
        }
        if (resourceData.detail) {
            setCurrent(resourceData.detail);
        }
    }, [resourceData]);

    // Fetch functions
    const fetchDatas = useCallback(async ({
        qStr = '',
        doRefresh = false
    } = {}) => {
        setLoading(true);
        try {
            console.log(`[${resourceName}] Fetching data...`);
            const response = await getAll(qStr).unwrap();
            const results = Array.isArray(response)
                ? response
                : response.results || response.resource || [];


            setData(results);
            setMeta(response.meta || {});

            dispatch(setResource({
                resource: resourceName,
                data: results,
                type: 'list'
            }));

            setLoading(false);
            if (doRefresh) dispatch(toggleRefresh(false));

            logMessage('Success', `${capitalizeName} data loaded successfully`, {
                type: 'info'
            });

            return response;
        } catch (error) {
            setLoading(false);

            console.error(`[${resourceName}] Fetch error:`, error);

            logMessage('Error', error?.data?.message || 'A server error occurred', {
                type: 'error',
                error,
            });

            return error;
        }
    }, [getAll, resourceName, dispatch, capitalizeName]);

    const fetchData = useCallback(async ({
        id,
        qStr = '',
        doRefresh = false
    } = {}) => {
        setLoading(true);
        try {
            const response = await getById({ id, qStr }).unwrap();
            setCurrent(response);
            dispatch(setResource({
                resource: resourceName,
                data: response,
                type: 'detail'
            }));
            setLoading(false);
            if (doRefresh) dispatch(toggleRefresh(false));

            logMessage('Success', `${capitalizeName} detail loaded successfully`, {
                type: 'info'
            });

            return response;
        } catch (error) {
            setLoading(false);

            const title = error.status === 404 ? 'Not Found' : 'Error';
            const message = error.status === 404
                ? 'The requested resource was not found.'
                : error?.data?.message || 'A server error occurred';

            logMessage(title, message, {
                type: 'error',
                error,
            });

            return error;
        }
    }, [getById, resourceName, dispatch, capitalizeName]);

    const fetchBySlug = useCallback(async ({
        slug,
        qStr = '',
        doRefresh = false
    } = {}) => {
        setLoading(true);
        try {
            const response = await getBySlug({ slug, qStr }).unwrap();
            setCurrent(response);
            dispatch(setResource({
                resource: resourceName,
                data: response,
                type: 'detail'
            }));
            setLoading(false);
            if (doRefresh) dispatch(toggleRefresh(false));

            logMessage('Success', `${capitalizeName} detail loaded successfully`, {
                type: 'info'
            });

            return response;
        } catch (error) {
            setLoading(false);

            const title = error.status === 404 ? 'Not Found' : 'Error';
            const message = error.status === 404
                ? 'The requested resource was not found.'
                : error?.data?.message || 'A server error occurred';

            logMessage(title, message, {
                type: 'error',
                error,
            });

            return error;
        }
    }, [getBySlug, resourceName, dispatch, capitalizeName]);

    // CRUD operations
    const doStore = useCallback(async (data, silence = false) => {
        setLoading(true);
        try {
            const response = await create(data).unwrap();
            setCurrent(response);

            logMessage('Success', 'Record added successfully', {
                type: 'info',
            });

            setLoading(false);
            dispatch(toggleRefresh(true));
            return response;
        } catch (error) {
            setLoading(false);

            logMessage('Error', error?.data?.message || 'A server error occurred', {
                type: 'error',
                error,
            });

            return error;
        }
    }, [create, dispatch]);

    const doUpdate = useCallback(async (id, data) => {
        setLoading(true);
        try {
            const response = await update({ id, data }).unwrap();
            setCurrent(response);

            logMessage('Success', 'Record updated successfully', {
                type: 'info',
            });

            setLoading(false);
            dispatch(toggleRefresh(true));
            return response;
        } catch (error) {
            setLoading(false);

            logMessage('Error', error?.data?.message || 'A server error occurred', {
                type: 'error',
                error,
            });

            return error;
        }
    }, [update, dispatch]);

    const doDestroy = useCallback(async (id) => {
        setLoading(true);
        try {
            const response = await deleteItem(id).unwrap();

            logMessage('Success', 'Record deleted successfully', {
                type: 'info',
            });

            setLoading(false);
            dispatch(toggleRefresh(true));
            return response;
        } catch (error) {
            setLoading(false);

            logMessage('Error', error?.data?.message || 'A server error occurred', {
                type: 'error',
                error,
            });

            return error;
        }
    }, [deleteItem, dispatch]);

    // Event handlers
    const onStore = useCallback(async (data) => {
        return doStore(data).then((response) => {
            fetchDatas();
            return response;
        });
    }, [doStore, fetchDatas]);

    const onUpdate = useCallback(async (id, data) => {
        return doUpdate(id, data).then((response) => {
            fetchDatas();
            return response;
        });
    }, [doUpdate, fetchDatas]);

    const onDestroy = useCallback(async (id) => {
        return doDestroy(id).then((response) => {
            fetchDatas();
            setData(prevData => prevData.filter(d => d.id !== id));
            dispatch(setResource({
                resource: resourceName,
                data: data.filter(d => d.id !== id),
                type: 'list'
            }));
            return response;
        });
    }, [doDestroy, fetchDatas, data, dispatch, resourceName]);

    // Navigation methods
    const toForm = useCallback((id = null) => {
        if (id) {
            navigation.navigate(`${kebabCaseName}Edit`, { id });
        } else {
            navigation.navigate(`${kebabCaseName}Add`);
        }
    }, [navigation, kebabCaseName]);

    const toView = useCallback((id) => {
        navigation.navigate(`${kebabCaseName}View`, { id });
    }, [navigation, kebabCaseName]);

    return {
        names: {
            camelCaseName,
            kebabCaseName,
            pascalCaseName,
            capitalizeName,
        },
        actions: {
            fetchDatas,
            fetchData,
            fetchBySlug,
            doStore,
            doUpdate,
            doDestroy
        },
        states: {
            data,
            resourceEndpoints,
            refresh,
            meta,
            current,
            selected,
            loading,
            setMeta,
            setCurrent,
            setSelected,
            setData
        },
        events: {
            onStore,
            onUpdate,
            onDestroy
        },
        navigate: {
            toForm,
            toView
        },
        logging: {
            ALERT_LEVEL,
            logMessage
        }
    };
}
