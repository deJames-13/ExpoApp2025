import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
    DataTable,
    Button,
    IconButton,
    Dialog,
    Portal,
    TextInput,
    Text,
    Searchbar,
    Menu,
    Divider
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DashboardTable = ({
    initialData = [],
    columns = [],
    title = "Data Management",
    onSave = () => { },
    onUpdate = () => { },
    onDelete = () => { },
    searchable = true,
    editable = true,
    deletable = true,
    addable = true
}) => {
    // State management
    const [data, setData] = useState(initialData);
    const [page, setPage] = useState(0);
    const [numberOfItemsPerPageList] = useState([5, 10, 15, 20]);
    const [itemsPerPage, setItemsPerPage] = useState(numberOfItemsPerPageList[0]);
    const [sortedBy, setSortedBy] = useState(null);
    const [sortDirection, setSortDirection] = useState('ascending');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState(data);

    // Dialog state
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMode, setDialogMode] = useState('add'); // 'add', 'edit', 'delete'
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({});

    // Menu state
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState({ x: 0, y: 0 });

    // Calculate pagination values
    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, filteredData.length);

    // Reset page when items per page changes
    useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    // Update filtered data when search query or data changes
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredData(data);
        } else {
            const lowercasedQuery = searchQuery.toLowerCase();
            const filtered = data.filter(item =>
                columns.some(col =>
                    String(item[col.key]).toLowerCase().includes(lowercasedQuery)
                )
            );
            setFilteredData(filtered);
            setPage(0);
        }
    }, [searchQuery, data, columns]);

    // Set filtered data when initial data changes
    useEffect(() => {
        setData(initialData);
        setFilteredData(initialData);
    }, [initialData]);

    // Handle sorting
    const handleSort = (key) => {
        let direction = 'ascending';

        if (sortedBy === key) {
            direction = sortDirection === 'ascending' ? 'descending' : 'ascending';
        }

        const sorted = [...filteredData].sort((a, b) => {
            const valueA = a[key];
            const valueB = b[key];

            if (typeof valueA === 'string') {
                return direction === 'ascending'
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
            }

            return direction === 'ascending'
                ? valueA - valueB
                : valueB - valueA;
        });

        setSortedBy(key);
        setSortDirection(direction);
        setFilteredData(sorted);
    };

    // Dialog handlers
    const showAddDialog = () => {
        const emptyForm = {};
        columns.forEach(col => {
            emptyForm[col.key] = '';
        });
        setFormData(emptyForm);
        setDialogMode('add');
        setDialogVisible(true);
    };

    const showEditDialog = (item) => {
        setSelectedItem(item);
        setFormData({ ...item });
        setDialogMode('edit');
        setDialogVisible(true);
    };

    const showDeleteDialog = (item) => {
        setSelectedItem(item);
        setDialogMode('delete');
        setDialogVisible(true);
    };

    const hideDialog = () => {
        setDialogVisible(false);
        setSelectedItem(null);
    };

    // Form handlers
    const handleFormChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // CRUD Operations
    const handleAdd = () => {
        const newItem = {
            ...formData,
            key: Date.now() // Generate a unique key
        };

        const newData = [...data, newItem];
        setData(newData);
        onSave(newItem);
        hideDialog();
    };

    const handleEdit = () => {
        const updatedData = data.map(item =>
            item.key === selectedItem.key ? formData : item
        );

        setData(updatedData);
        onUpdate(formData);
        hideDialog();
    };

    const handleDelete = () => {
        const updatedData = data.filter(item => item.key !== selectedItem.key);
        setData(updatedData);
        onDelete(selectedItem);
        hideDialog();
    };

    // Render table header
    const renderHeader = () => (
        <DataTable.Header>
            {columns.map(col => (
                <DataTable.Title
                    key={col.key}
                    numeric={col.numeric}
                    sortDirection={sortedBy === col.key ? sortDirection : 'none'}
                    onPress={() => handleSort(col.key)}
                >
                    {col.title}
                </DataTable.Title>
            ))}
            {(editable || deletable) && (
                <DataTable.Title style={styles.actionColumn}>Actions</DataTable.Title>
            )}
        </DataTable.Header>
    );

    // Render table rows
    const renderRows = () => (
        filteredData.slice(from, to).map((item) => (
            <DataTable.Row key={item.key}>
                {columns.map(col => (
                    <DataTable.Cell
                        key={`${item.key}-${col.key}`}
                        numeric={col.numeric}
                    >
                        {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </DataTable.Cell>
                ))}
                {(editable || deletable) && (
                    <DataTable.Cell style={styles.actionColumn}>
                        <View style={styles.actionButtons}>
                            {editable && (
                                <IconButton
                                    icon="pencil"
                                    size={20}
                                    onPress={() => showEditDialog(item)}
                                />
                            )}
                            {deletable && (
                                <IconButton
                                    icon="delete"
                                    size={20}
                                    onPress={() => showDeleteDialog(item)}
                                />
                            )}
                        </View>
                    </DataTable.Cell>
                )}
            </DataTable.Row>
        ))
    );

    // Render dialog based on mode
    const renderDialog = () => {
        const dialogTitle = {
            'add': 'Add New Item',
            'edit': 'Edit Item',
            'delete': 'Confirm Delete'
        }[dialogMode];

        return (
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={hideDialog}>
                    <Dialog.Title>{dialogTitle}</Dialog.Title>
                    <Dialog.Content>
                        {dialogMode === 'delete' ? (
                            <Text>Are you sure you want to delete this item?</Text>
                        ) : (
                            columns.map(col => (
                                <TextInput
                                    key={col.key}
                                    label={col.title}
                                    value={String(formData[col.key] || '')}
                                    onChangeText={(text) => handleFormChange(col.key, text)}
                                    mode="outlined"
                                    style={styles.input}
                                />
                            ))
                        )}
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>Cancel</Button>
                        {dialogMode === 'add' && <Button onPress={handleAdd}>Add</Button>}
                        {dialogMode === 'edit' && <Button onPress={handleEdit}>Update</Button>}
                        {dialogMode === 'delete' && <Button onPress={handleDelete}>Delete</Button>}
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                {addable && (
                    <Button
                        mode="contained"
                        onPress={showAddDialog}
                        icon="plus"
                    >
                        Add New
                    </Button>
                )}
            </View>

            {searchable && (
                <Searchbar
                    placeholder="Search"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                />
            )}

            <ScrollView horizontal>
                <DataTable style={styles.table}>
                    {renderHeader()}
                    {renderRows()}

                    <DataTable.Pagination
                        page={page}
                        numberOfPages={Math.ceil(filteredData.length / itemsPerPage)}
                        onPageChange={setPage}
                        label={`${from + 1}-${to} of ${filteredData.length}`}
                        numberOfItemsPerPageList={numberOfItemsPerPageList}
                        numberOfItemsPerPage={itemsPerPage}
                        onItemsPerPageChange={setItemsPerPage}
                        showFastPaginationControls
                        selectPageDropdownLabel={'Rows per page'}
                    />
                </DataTable>
            </ScrollView>

            {renderDialog()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    searchBar: {
        marginBottom: 16,
    },
    actionColumn: {
        flex: 0.5,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    input: {
        marginBottom: 12,
    },
    table: {
        minWidth: '100%',
    },
});

export default DashboardTable;