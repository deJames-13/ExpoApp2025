import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setResource, toggleRefresh } from '~/states/slices/resources';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

import * as changeCase from "change-case";
import resourceEndpoints from '~/states/api/resources';

export default function useResource(resourceName) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const resources = useSelector((state) => state?.resources || {});
    const refresh = resources?.refresh;

    // Name formats
    const camelCaseName = changeCase.camelCase(resourceName);
    const kebabCaseName = changeCase.snakeCase(resourceName).replace('_', '-');
    const pascalCaseName = changeCase.pascalCase(resourceName);
    const capitalizeName = changeCase.capitalCase(resourceName);

    const resource = resourceEndpoints;
    const [getAll] = resource[`useGetAll${pascalCaseName}Mutation`]();
    const [getById] = resource[`useGet${pascalCaseName}ByIdMutation`]();
    const [getBySlug] = resource[`useGet${pascalCaseName}BySlugMutation`]();
    const [create] = resource[`useStore${pascalCaseName}Mutation`]();
    const [update] = resource[`useUpdate${pascalCaseName}Mutation`]();
    const [deleteItem] = resource[`useDelete${pascalCaseName}Mutation`]();

    // States
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState({});
    const [current, setCurrent] = useState(null);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch functions
    const fetchDatas = useCallback(async ({
        qStr = '',
        doRefresh = false
    } = {}) => {
        if (resources?.list[resourceName]) {
            setData(resources?.list[resourceName]);
        }
        setLoading(true);
        return await getAll(qStr)
            .unwrap()
            .then((response) => {
                const results = Array.isArray(response) ? response : response.results || response.data || [];
                setData(results);
                setMeta(response.meta || {});
                dispatch(setResource({
                    resource: resourceName,
                    data: results,
                    type: 'list'
                }));
                setLoading(false);
                doRefresh && dispatch(toggleRefresh(false));
                return response;
            })
            .catch((error) => {
                setLoading(false);
                Alert.alert('Error', error?.data?.message || 'A server error occurred');
                return error;
            });
    }, [getAll, resourceName, dispatch]);

    const fetchData = useCallback(async ({
        id,
        qStr = '',
        doRefresh = false
    } = {}) => {
        if (resources?.detail[resourceName]) {
            setCurrent(resources?.detail[resourceName]);
        }
        setLoading(true);
        return await getById({ id, qStr })
            .unwrap()
            .then((response) => {
                setCurrent(response);
                dispatch(setResource({
                    resource: resourceName,
                    data: response,
                    type: 'detail'
                }));
                setLoading(false);
                doRefresh && dispatch(toggleRefresh(false));
                return response;
            })
            .catch((error) => {
                setLoading(false);
                if (error.status === 404) {
                    Alert.alert('Not Found', 'The requested resource was not found.');
                } else {
                    Alert.alert('Error', error?.data?.message || 'A server error occurred');
                }
                return error;
            });
    }, [getById, resourceName, dispatch]);

    // Add fetchBySlug function
    const fetchBySlug = useCallback(async ({
        slug,
        qStr = '',
        doRefresh = false
    } = {}) => {
        setLoading(true);
        return await getBySlug({ slug, qStr })
            .unwrap()
            .then((response) => {
                setCurrent(response);
                dispatch(setResource({
                    resource: resourceName,
                    data: response,
                    type: 'detail'
                }));
                setLoading(false);
                doRefresh && dispatch(toggleRefresh(false));
                return response;
            })
            .catch((error) => {
                setLoading(false);
                if (error.status === 404) {
                    Alert.alert('Not Found', 'The requested resource was not found.');
                } else {
                    Alert.alert('Error', error?.data?.message || 'A server error occurred');
                }
                return error;
            });
    }, [getBySlug, resourceName, dispatch]);

    // CRUD operations
    const doStore = useCallback(async (data, silence = false) => {
        setLoading(true);
        return await create(data)
            .unwrap()
            .then((response) => {
                setCurrent(response);
                !silence && Alert.alert('Success', 'Record added successfully');
                setLoading(false);
                dispatch(toggleRefresh(true));
                return response;
            })
            .catch((error) => {
                setLoading(false);
                !silence && Alert.alert('Error', error?.data?.message || 'A server error occurred');
                return error;
            });
    }, [create, dispatch]);

    const doUpdate = useCallback(async (id, data) => {
        setLoading(true);
        return await update({ id, data })
            .unwrap()
            .then((response) => {
                setCurrent(response);
                Alert.alert('Success', 'Record updated successfully');
                setLoading(false);
                dispatch(toggleRefresh(true));
                return response;
            })
            .catch((error) => {
                setLoading(false);
                Alert.alert('Error', error?.data?.message || 'A server error occurred');
                return error;
            });
    }, [update, dispatch]);

    const doDestroy = useCallback(async (id) => {
        setLoading(true);
        return await deleteItem(id)
            .unwrap()
            .then((response) => {
                Alert.alert('Success', 'Record deleted successfully');
                setLoading(false);
                dispatch(toggleRefresh(true));
                return response;
            })
            .catch((error) => {
                setLoading(false);
                Alert.alert('Error', error?.data?.message || 'A server error occurred');
                return error;
            });
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
        }
    };
}
