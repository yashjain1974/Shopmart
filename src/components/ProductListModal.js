import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity,
  TextInput,
  ActivityIndicator 
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import productData from '../../assets/data/products.json';

const ProductListModal = ({ isVisible, onClose, productIds = [] }) => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Filter products based on productIds and search query
  const filteredProducts = useMemo(() => {
    // First filter by productIds
    let products = productIds.length 
      ? productData.products.filter(product => productIds.includes(product.id))
      : productData.products;

    // Then filter by search query if it exists
    if (searchQuery) {
      return products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return products;
  }, [productIds, searchQuery]);

  // Simulate loading for better UX
  useEffect(() => {
    if (isVisible) {
      setLoading(true);
      // Simulate loading delay
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, productIds]);

  const handleProductPress = (productId) => {
    onClose();
    navigation.navigate('ProductDetail', { productId });
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.productItem} 
      onPress={() => handleProductPress(item.id)}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: item.images[0] }} 
        style={styles.productImage}
        defaultSource={require('../../assets/splash.png')}
      />
      <View style={styles.productInfo}>
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>${item.price}</Text>
          <Text style={styles.productCategory}>{item.category}</Text>
        </View>
        <View style={styles.rightContent}>
          {item.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
          <Icon name="chevron-right" type="material" color="#888" size={24} />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!isVisible) return null;

  return (
    <View style={[styles.modal, styles.show]}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>
          Products in this Reel ({filteredProducts.length})
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Icon name="close" type="material" color="#333" size={24} />
        </TouchableOpacity>
      </View>

      {filteredProducts.length > 1 && (
        <View style={styles.searchContainer}>
          <Icon name="search" type="material" color="#888" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      )}

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#9c6da6" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Icon name="inbox" type="material" size={48} color="#ccc" />
              <Text style={styles.emptyText}>
                {searchQuery 
                  ? 'No products match your search'
                  : 'No products available in this reel'}
              </Text>
            </View>
          )}
          contentContainerStyle={[
            styles.listContainer,
            !filteredProducts.length && styles.emptyListContainer
          ]}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
          bounces={true}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  show: {
    display: 'flex',
  },
  hide: {
    display: 'none',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: '#f0f0f0',
  },
  productInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productDetails: {
    flex: 1,
    marginRight: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    color: '#9c6da6',
    fontWeight: '600',
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 13,
    color: '#666',
    textTransform: 'capitalize',
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  newBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  separator: {
    height: 10,
  },
});

export default ProductListModal;