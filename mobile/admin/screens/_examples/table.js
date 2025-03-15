import React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import DashboardTable from '../../components/table';

export default function ExampleTable() {
    const initialData = [
        {
            key: 1,
            name: 'Cupcake',
            calories: 356,
            fat: 16,
            category: 'Dessert',
            status: 'In Stock'
        },
        {
            key: 2,
            name: 'Eclair',
            calories: 262,
            fat: 16,
            category: 'Dessert',
            status: 'Low Stock'
        },
        {
            key: 3,
            name: 'Frozen yogurt',
            calories: 159,
            fat: 6,
            category: 'Dessert',
            status: 'In Stock'
        },
        {
            key: 4,
            name: 'Gingerbread',
            calories: 305,
            fat: 3.7,
            category: 'Pastry',
            status: 'Out of Stock'
        },
    ];

    const columns = [
        { key: 'name', title: 'Name', numeric: false },
        { key: 'calories', title: 'Calories', numeric: true },
        { key: 'fat', title: 'Fat (g)', numeric: true },
        { key: 'category', title: 'Category', numeric: false },
        {
            key: 'status',
            title: 'Status',
            numeric: false,

            render: (value) => {
                let color;
                switch (value) {
                    case 'In Stock':
                        color = 'green';
                        break;
                    case 'Low Stock':
                        color = 'orange';
                        break;
                    case 'Out of Stock':
                        color = 'red';
                        break;
                    default:
                        color = 'black';
                }
                return <Text style={{ color }}>{value}</Text>;
            }
        }
    ];

    // Event handlers for CRUD operations
    const handleSave = (newItem) => {
        console.log('Item saved:', newItem);
        // Here you would typically make an API call to save the item
    };

    const handleUpdate = (updatedItem) => {
        console.log('Item updated:', updatedItem);
        // Here you would typically make an API call to update the item
    };

    const handleDelete = (deletedItem) => {
        console.log('Item deleted:', deletedItem);
        // Here you would typically make an API call to delete the item
    };

    return (
        <SafeAreaView style={styles.container}>
            <DashboardTable
                title="Dessert Inventory"
                initialData={initialData}
                columns={columns}
                onSave={handleSave}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                searchable={true}
                editable={true}
                deletable={true}
                addable={true}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
});