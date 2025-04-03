import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Card, Title, Text, Divider, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { adminColors, adminStyles } from '~/styles/adminTheme';
import { getStatusChipStyle } from '~/styles/adminThemeUtils';
import useResource from '~/hooks/useResource';
import { ProductImageGallery } from './components/ProductImageGallery';
import { IconButton } from 'react-native-paper';
import { ProductModal } from './modal';
import { createHybridFormData } from '~/utils/imageUpload';

const ProductDetail = ({ route, navigation }) => {
    const { productId } = route.params || {};

    const {
        states: { current: product, loading },
        actions: { fetchData, doUpdate },
        toast: { showSuccess, showError }
    } = useResource({ resourceName: 'products' });

    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('edit');

    useEffect(() => {
        loadProductDetails();
    }, [productId]);

    const loadProductDetails = async () => {
        if (!productId) {
            showError('Error', 'Product ID is missing');
            return;
        }

        setRefreshing(true);
        try {
            const response = await fetchData({ id: productId });
            console.log(response)
        } catch (error) {
            console.error('Error loading product details:', error);
            showError('Error', 'Failed to load product details');
        } finally {
            setRefreshing(false);
        }
    };

    // Handle editing via modal
    const handleEdit = () => {
        setModalMode('edit');
        setModalVisible(true);
    };

    // Handle saving product from modal with image upload
    const handleSaveProduct = async (productData) => {
        try {
            // Extract images from product data
            const { images, productImages, ...productInfo } = productData;

            // Get the images array from either source
            const uploadImages = productImages || images || [];

            // Log update request
            console.log('[ProductDetail] Update Request Data:', {
                productId: product._id || product.id,
                productInfo,
                hasImages: uploadImages.length > 0
            });

            // Create FormData with images for upload
            let formData;

            if (uploadImages && uploadImages.length > 0) {
                // Handle image uploads - convert to form data
                formData = await createHybridFormData(
                    productInfo,
                    { image: uploadImages[0] }, // Send first image for upload
                    true // Use base64
                );
            } else {
                // No images to upload
                formData = await createHybridFormData(productInfo, {}, true);
            }

            // Log the request payload
            console.log('[ProductDetail] Sending update request to API');

            const response = await doUpdate(product._id || product.id, formData);

            // Log the response
            console.log('[ProductDetail] Update Response:', response);

            showSuccess('Success', 'Product updated successfully');
            setModalVisible(false);

            // Fetch fresh data after update
            await loadProductDetails();
        } catch (error) {
            // Log error
            console.error('[ProductDetail] Update Error:', error);
            showError('Error', 'Failed to update product');
        }
    };

    // Handle modal close
    const handleModalClose = () => {
        setModalVisible(false);
    };

    // Get status style based on stock level
    const getStockStatusStyle = (stock) => {
        let status = 'out of stock';
        if (stock > 10) status = 'active';
        else if (stock > 0) status = 'pending';

        return getStatusChipStyle(status);
    };

    if (loading || refreshing) {
        return (
            <View style={adminStyles.loadingContainer}>
                <ActivityIndicator size="large" color={adminColors.primary} />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={adminStyles.loadingContainer}>
                <Text style={styles.errorText}>Product not found</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={adminStyles.safeArea}>
            <View style={styles.header}>
                <IconButton
                    icon="arrow-left"
                    size={24}
                    onPress={() => navigation.goBack()}
                />
                <Title style={styles.headerTitle}>Product Details</Title>
                <IconButton
                    icon="pencil"
                    size={24}
                    onPress={handleEdit}
                    color={adminColors.primary}
                />
            </View>

            <ScrollView style={adminStyles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Product Images */}
                {product.images && product.images.length > 0 && (
                    <ProductImageGallery images={product.images} />
                )}

                {/* Basic Info Card */}
                <Card style={adminStyles.card}>
                    <Card.Content>
                        <Title style={adminStyles.cardTitle}>{product.name}</Title>

                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Price:</Text>
                            <Text style={styles.priceValue}>${parseFloat(product.price).toFixed(2)}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Stock:</Text>
                            <Chip
                                style={[
                                    styles.statusChip,
                                    getStockStatusStyle(product.stock).chip
                                ]}
                                textStyle={getStockStatusStyle(product.stock).text}
                            >
                                {product.stock} {product.stock === 1 ? 'unit' : 'units'}
                            </Chip>
                        </View>

                        {product.status && (
                            <View style={styles.row}>
                                <Text style={styles.label}>Status:</Text>
                                <Chip
                                    style={[
                                        styles.statusChip,
                                        getStatusChipStyle(product.status).chip
                                    ]}
                                    textStyle={getStatusChipStyle(product.status).text}
                                >
                                    {product.status}
                                </Chip>
                            </View>
                        )}
                    </Card.Content>
                </Card>

                {/* Category and Brand Card */}
                <Card style={adminStyles.card}>
                    <Card.Content>
                        <Title style={adminStyles.sectionTitle}>Classification</Title>
                        <View style={styles.row}>
                            <Text style={styles.label}>Category:</Text>
                            <Text style={styles.value}>{product.category || 'Uncategorized'}</Text>
                        </View>

                        <Divider style={styles.divider} />

                        <View style={styles.row}>
                            <Text style={styles.label}>Brand:</Text>
                            <Text style={styles.value}>{product.brand || 'No Brand'}</Text>
                        </View>

                        {product.supplier && (
                            <>
                                <Divider style={styles.divider} />
                                <View style={styles.row}>
                                    <Text style={styles.label}>Supplier:</Text>
                                    <Text style={styles.value}>{product.supplier || 'No Supplier'}</Text>
                                </View>
                            </>
                        )}
                    </Card.Content>
                </Card>

                {/* Description Card */}
                {product.description && (
                    <Card style={adminStyles.card}>
                        <Card.Content>
                            <Title style={adminStyles.sectionTitle}>Description</Title>
                            <Text style={styles.description}>{product.description}</Text>
                        </Card.Content>
                    </Card>
                )}

                {/* Additional Info Card */}
                <Card style={[adminStyles.card, styles.lastCard]}>
                    <Card.Content>
                        <Title style={adminStyles.sectionTitle}>Additional Information</Title>

                        <View style={styles.row}>
                            <Text style={styles.label}>Rating:</Text>
                            <Text style={styles.value}>{product.averageRating ? `${product.averageRating.toFixed(1)} / 5.0` : 'No ratings yet'}</Text>
                        </View>

                        <Divider style={styles.divider} />

                        <View style={styles.row}>
                            <Text style={styles.label}>Created:</Text>
                            <Text style={styles.value}>{new Date(product.createdAt).toLocaleDateString()}</Text>
                        </View>

                        <Divider style={styles.divider} />

                        <View style={styles.row}>
                            <Text style={styles.label}>Last Updated:</Text>
                            <Text style={styles.value}>{new Date(product.updatedAt).toLocaleDateString()}</Text>
                        </View>

                        <Divider style={styles.divider} />

                        <View style={styles.row}>
                            <Text style={styles.label}>Product ID:</Text>
                            <Text style={styles.value}>{product._id || product.id}</Text>
                        </View>
                    </Card.Content>
                </Card>
            </ScrollView>

            {/* Product Edit Modal */}
            <ProductModal
                visible={modalVisible}
                onDismiss={handleModalClose}
                product={product}
                onSave={handleSaveProduct}
                mode={modalMode}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 12,
        backgroundColor: adminColors.cardBackground,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1.5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: adminColors.text.primary,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 30,
    },
    errorText: {
        fontSize: 16,
        color: adminColors.status.error,
    },
    lastCard: {
        marginBottom: 30, // Extra margin for the last card
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 12,
    },
    priceLabel: {
        fontSize: 16,
        color: adminColors.text.secondary,
    },
    priceValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: adminColors.primary,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8,
    },
    label: {
        fontSize: 14,
        color: adminColors.text.secondary,
        fontWeight: '500',
    },
    value: {
        fontSize: 14,
        color: adminColors.text.primary,
        textAlign: 'right',
        flex: 1,
        marginLeft: 8,
    },
    statusChip: {
        height: 30,
        borderRadius: 15,
    },
    divider: {
        marginVertical: 8,
        backgroundColor: 'rgba(0,0,0,0.06)',
    },
    description: {
        fontSize: 14,
        lineHeight: 22,
        color: adminColors.text.primary,
    },
});

export default ProductDetail;