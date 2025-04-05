import React, { useState, useCallback, useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { usersData, fetchUsers, deleteUser, createUser, updateUser, getUserById } from './data'
import { userColumns, userActions } from './table-data'
import { UserModal } from './modal'
import { ResourceTable } from '~/components/ResourceTable'

export function UsersScreen() {
  const [users, setUsers] = useState(usersData);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentSort, setCurrentSort] = useState({ field: 'username', direction: 'asc' });
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
    last_page: 0
  });

  // Add refs to track previous values for comparison
  const prevQueryRef = useRef('');
  const isInitialLoadRef = useRef(true);
  const tableKeyRef = useRef(`users-table-${Date.now()}`);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedUser, setSelectedUser] = useState(null);

  // Build query parameters for API requests
  const buildQueryParams = () => {
    // Create query params for API request
    const params = new URLSearchParams();
    params.append('page', pagination.page);
    params.append('limit', pagination.limit);

    if (searchText) params.append('search', searchText);

    if (currentSort.field) {
      // Convert direction to sort order (1 for asc, -1 for desc)
      const order = currentSort.direction === 'desc' ? -1 : 1;
      params.append('sort', JSON.stringify({ [currentSort.field]: order }));
    }

    return params.toString();
  };

  // Fetch users with backend pagination
  const loadUsers = useCallback(async (page = pagination.page, limit = pagination.limit, search = searchText, sort = currentSort) => {
    setLoading(true);
    try {
      const queryString = buildQueryParams();

      // Update the previous query ref
      prevQueryRef.current = queryString;

      const result = await fetchUsers(page, limit, search, sort);

      if (result.users) {
        setUsers(result.users);
        setPagination(prev => ({
          ...prev,
          ...result.pagination,
          // Use server's last_page as pages if available
          pages: result.pagination.last_page ||
            Math.ceil(result.pagination.total / result.pagination.limit)
        }));
      } else {
        console.error('Failed to fetch users data');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [pagination.page, pagination.limit, searchText, currentSort]);

  // Effect to handle changes in pagination, search, or sort parameters
  useEffect(() => {
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      loadUsers();
      return;
    }

    const queryString = buildQueryParams();

    if (queryString !== prevQueryRef.current) {
      prevQueryRef.current = queryString;
      loadUsers();
    }
  }, [pagination.page, pagination.limit, searchText, currentSort]);

  // Effect to handle edge cases when pagination info changes from API
  useEffect(() => {
    // Adjust current page if it's greater than the server's last_page
    if (pagination.pages > 0 && pagination.page > pagination.pages) {
      setPagination(prev => ({
        ...prev,
        page: pagination.pages
      }));
    }
  }, [pagination.pages, pagination.page]);

  // Open modal for creating a new user
  const handleAddUser = useCallback(() => {
    setModalMode('create');
    setSelectedUser(null);
    setModalVisible(true);
  }, []);

  // Action handlers
  const handleView = useCallback((user) => {
    setModalMode('view');
    setSelectedUser(user);
    setModalVisible(true);
  }, []);

  const handleEdit = useCallback(async (user) => {
    try {
      setLoading(true);
      console.log("User selected for edit:", JSON.stringify(user, null, 2));
      
      // First clear any previous user data
      setModalVisible(false); // Close modal first if open
      setSelectedUser(null); // Clear previous user
      
      // Fetch complete user data with all info details
      const userData = await getUserById(user.id || user._id);
      console.log("User data fetched for edit:", JSON.stringify(userData, null, 2));
      
      // Check if we have all the required fields
      if (userData.info) {
        console.log("Edit modal - Info object fields:", Object.keys(userData.info));
        console.log("First name:", userData.info.first_name);
        console.log("Last name:", userData.info.last_name);
        console.log("City:", userData.info.city);
        console.log("Region:", userData.info.region);
      }
      
      // Set modal mode and user data in the correct order
      setModalMode('edit');
      setSelectedUser(userData);
      
      // Then show the modal after a small delay to ensure state is updated
      setTimeout(() => {
        setModalVisible(true);
      }, 100);
    } catch (error) {
      console.error("Error loading user details:", error);
      Alert.alert("Error", "Failed to load user details");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = useCallback((user) => {
    Alert.alert(
      "Delete User",
      `Are you sure you want to delete ${user.username || user.email}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUser(user.id || user._id);
              // Refresh the current page after deletion
              loadUsers();
            } catch (error) {
              Alert.alert("Error", "Failed to delete user");
            }
          }
        }
      ]
    );
  }, [loadUsers]);

  // Handle saving user from modal
  const handleSaveUser = useCallback(async (userData) => {
    try {
      if (modalMode === 'create') {
        await createUser(userData);
        // Refresh to first page after creation
        setPagination(prev => ({ ...prev, page: 1 }));
        loadUsers(1, pagination.limit, searchText, currentSort);
      } else if (modalMode === 'edit') {
        await updateUser(selectedUser.id || selectedUser._id, userData);
        // Stay on current page after edit
        loadUsers();
      }
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving user:", error);
      Alert.alert("Error", `Failed to ${modalMode === 'create' ? 'create' : 'update'} user`);
    }
  }, [modalMode, selectedUser, pagination, searchText, currentSort, loadUsers]);

  // Configure action handlers for the table
  const actions = userActions.map(action => {
    if (action.id === 'view') {
      return { ...action, onPress: handleView };
    } else if (action.id === 'edit') {
      return { ...action, onPress: handleEdit };
    } else if (action.id === 'delete') {
      return { ...action, onPress: handleDelete };
    }
    return action;
  });

  // Refresh handler
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPagination(prev => ({ ...prev, page: 1 }));
    loadUsers(1, pagination.limit, searchText, currentSort);
    tableKeyRef.current = `users-table-${Date.now()}`; // Force table remount
  }, [pagination.limit, searchText, currentSort, loadUsers]);

  // Search handler (backend search)
  const handleSearch = useCallback((query) => {
    if (query !== searchText) {
      setSearchText(query);
      setPagination(prev => ({ ...prev, page: 1 }));
      loadUsers(1, pagination.limit, query, currentSort);
    }
  }, [pagination.limit, currentSort, loadUsers, searchText]);

  // Pagination handler (backend pagination)
  const handlePageChange = useCallback((page, itemsPerPage) => {
    const updatedPagination = { ...pagination };

    // Only update if values actually changed
    if (page !== pagination.page) {
      updatedPagination.page = page;
    }

    if (itemsPerPage !== pagination.limit) {
      updatedPagination.limit = itemsPerPage;
      // Reset to page 1 when changing items per page
      updatedPagination.page = 1;
    }

    // Update pagination state
    setPagination(updatedPagination);
  }, [pagination]);

  // Sorting handler (backend sorting)
  const handleSortChange = useCallback((sortConfig) => {
    if (sortConfig.field !== currentSort.field ||
      sortConfig.direction !== currentSort.direction) {
      setCurrentSort(sortConfig);
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  }, [currentSort]);

  // Handle manual refresh
  const handleManualRefresh = useCallback(() => {
    tableKeyRef.current = `users-table-${Date.now()}`; // Force table remount
    loadUsers();
  }, [loadUsers]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View className="flex-1 px-4 pt-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-gray-800">Users</Text>
          <TouchableOpacity
            className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center"
            onPress={handleAddUser}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text className="text-white font-medium ml-1">Add User</Text>
          </TouchableOpacity>
        </View>

        {/* Table with server-side operations */}
        <View className="flex-1 bg-white rounded-lg shadow-sm">
          <ResourceTable
            key={tableKeyRef.current}
            data={users}
            columns={userColumns}
            actions={actions}
            emptyText="No users found"
            imageField="info.avatar"
            subtitleField="email"
            onRefresh={handleRefresh}
            refreshing={refreshing}
            loading={loading}

            // Server-side configuration
            serverSide={true}
            totalServerItems={pagination.total}

            // Pagination configuration - use the server's pages count
            pagination={true}
            initialItemsPerPage={pagination.limit}
            onPageChange={handlePageChange}
            currentPage={pagination.page}
            totalPages={pagination.pages}

            // Search configuration
            searchEnabled={true}
            onSearch={handleSearch}

            // Sorting configuration
            initialSort={currentSort}
            onSortChange={handleSortChange}
          />
        </View>

        {/* User Modal for create/edit/view */}
        <UserModal
          key={`modal-${selectedUser?._id || 'new'}-${modalMode}`} // Add key prop to force re-render
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          user={selectedUser}
          onSave={handleSaveUser}
          mode={modalMode}
          debug={true}
        />
      </View>
    </SafeAreaView>
  )
}

export default UsersScreen;