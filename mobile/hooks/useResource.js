import { useCallback, useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { setResource, toggleRefresh } from '~/states/slices/resources';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import * as changeCase from "change-case";
import resourceEndpoints from '~/states/api/resources';

// Message templates
const messages = {
  fetch: {
    success: (resource) => `${resource} data loaded successfully`,
    error: (error) => error?.data?.message || 'Failed to load data'
  },
  fetchOne: {
    success: (resource) => `${resource} details loaded successfully`,
    error: (error) => error?.data?.message || 'Failed to load details'
  },
  create: {
    success: () => 'Record added successfully',
    error: (error) => error?.data?.message || 'Failed to create record'
  },
  update: {
    success: () => 'Record updated successfully',
    error: (error) => error?.data?.message || 'Failed to update record'
  },
  delete: {
    success: () => 'Record deleted successfully',
    error: (error) => error?.data?.message || 'Failed to delete record'
  }
};

export default function useResource({ resourceName, silent = true }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Standardized Toast Helper Functions - moved inside the hook
  const showToast = (options = {}) => {
    if (!silent) {
      Toast.show(options);
    }
  };

  const showSuccess = (text1 = 'Success', text2 = '', options = {}) => {
    if (!silent) {
      Toast.show({
        type: 'success',
        text1,
        text2,
        visibilityTime: 3000,
        ...options
      });
    }
  };

  const showError = (text1 = 'Error', text2 = '', options = {}) => {
    if (!silent) {
      Toast.show({
        type: 'error',
        text1,
        text2,
        visibilityTime: 4000,
        ...options
      });
    }
  };

  const showInfo = (text1 = 'Information', text2 = '', options = {}) => {
    if (!silent) {
      Toast.show({
        type: 'info',
        text1,
        text2,
        visibilityTime: 3000,
        ...options
      });
    }
  };

  const showWarning = (text1 = 'Warning', text2 = '', options = {}) => {
    if (!silent) {
      Toast.show({
        type: 'warning',
        text1,
        text2,
        visibilityTime: 4000,
        ...options
      });
    }
  };

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
    verbose = false,
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

      verbose && showSuccess(
        'Data Loaded',
        messages.fetch.success(capitalizeName)
      );

      return response;
    } catch (error) {
      setLoading(false);
      console.error(`[${resourceName}] Fetch error:`, error);

      // Standardized error toast
      showError(
        'Error',
        messages.fetch.error(error)
      );

      return error;
    }
  }, [getAll, resourceName, dispatch, capitalizeName]);

  const fetchData = useCallback(async ({
    id,
    qStr = '',
    verbose = false,
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

      verbose && showInfo(
        'Success',
        messages.fetchOne.success(capitalizeName)
      );

      return response;
    } catch (error) {
      setLoading(false);

      const title = error.status === 404 ? 'Not Found' : 'Error';
      const message = error.status === 404
        ? 'The requested resource was not found.'
        : error?.data?.message || 'A server error occurred';

      showError(
        title,
        message
      );

      return error;
    }
  }, [getById, resourceName, dispatch, capitalizeName]);

  const fetchBySlug = useCallback(async ({
    slug,
    qStr = '',
    doRefresh = false,
    verbose = true,
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

      verbose && showInfo(
        'Success',
        messages.fetchOne.success(capitalizeName)
      );

      return response;
    } catch (error) {
      setLoading(false);

      const title = error.status === 404 ? 'Not Found' : 'Error';
      const message = error.status === 404
        ? 'The requested resource was not found.'
        : error?.data?.message || 'A server error occurred';

      showError(
        title,
        message
      );

      return error;
    }
  }, [getBySlug, resourceName, dispatch, capitalizeName]);

  // CRUD operations
  const doStore = useCallback(async (data, verbose = false) => {
    setLoading(true);
    try {
      const response = await create(data).unwrap();
      setCurrent(response);

      if (!silent && !verbose) {
        showInfo(
          'Success',
          messages.create.success()
        );
      }

      setLoading(false);
      dispatch(toggleRefresh(true));
      return response;
    } catch (error) {
      setLoading(false);

      if (!silent && !silence) {
        showError(
          'Error',
          messages.create.error(error)
        );
      }

      return error;
    }
  }, [create, dispatch]);

  const doUpdate = useCallback(async (id, data, verbose = true) => {
    setLoading(true);
    try {
      const response = await update({ id, data }).unwrap();
      setCurrent(response);

      verbose && showInfo(
        'Success',
        messages.update.success()
      );

      setLoading(false);
      dispatch(toggleRefresh(true));
      return response;
    } catch (error) {
      setLoading(false);

      showError(
        'Error',
        messages.update.error(error)
      );

      return error;
    }
  }, [update, dispatch]);

  const doDestroy = useCallback(async (id, verbose = true) => {
    setLoading(true);
    try {
      const response = await deleteItem(id).unwrap();

      verbose && showInfo(
        'Success',
        messages.delete.success()
      );

      setLoading(false);
      dispatch(toggleRefresh(true));
      return response;
    } catch (error) {
      setLoading(false);

      showError(
        'Error',
        messages.delete.error(error)
      );

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
      current: current?.resource,
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
    toast: {
      showSuccess,
      showError,
      showInfo,
      showWarning,
      showToast
    }
  };
}
