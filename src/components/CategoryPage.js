import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SearchBar, Icon } from 'react-native-elements';
import HeaderPage from './Header';
import { useNavigation } from '@react-navigation/native';
import productData from '../../assets/data/products.json';
import { useCart } from '../store/CartContext';
const { width } = Dimensions.get('window');

// Banner data could also be moved to JSON if needed
const banners = [
  { id: '1', image: 'https://media.istockphoto.com/id/1271796113/photo/women-is-holding-handbag-near-luxury-car.jpg?s=612x612&w=0&k=20&c=-jtXLmexNgRa-eKqA1X8UJ8QYWhW7XgDiWNmzuuCHmM=' },
  { id: '2', image: 'https://i.imgur.com/UYiroysl.jpg' },
  { id: '3', image: 'https://macv.in/cdn/shop/collections/Sunglasses_banner_Desktop_1920_x_320.png?v=1691667927' },
];

const CategoryPage = ({ route }) => {
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price-low-high', 'price-high-low'
const [showFilters, setShowFilters] = useState(false);
  const { category } = route.params;
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const navigation = useNavigation();
  const { addToCart } = useCart();

  // Filter products based on category and search term
  useEffect(() => {
    const categoryProducts = productData.products.filter(
      product => product.category === category
    );

    if (searchTerm) {
      const filtered = categoryProducts.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(categoryProducts);
    }
  }, [category, searchTerm]);
  const sortProducts = (products) => {
    switch (sortBy) {
      case 'price-low-high':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-high-low':
        return [...products].sort((a, b) => b.price - a.price);
      case 'newest':
      default:
        return products;
    }
  };
  const renderBanner = ({ item }) => (
    <View style={styles.bannerContainer}>
      <Image source={{ uri: item.image }} style={styles.bannerImage} />
    </View>
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      {item.isNew && (
        <View style={styles.newBadgeContainer}>
          <Icon name="star" type="material" color="#FFD700" size={14} />
          <Text style={styles.newBadgeText}>NEW</Text>
        </View>
      )}
      <Image 
        source={{ uri: item.images[0] }} // Use first image from images array
        style={styles.productImage} 
      />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>$ {item.price}</Text>
      <TouchableOpacity 
        style={styles.addToBagButton}
        onPress={() => handleAddToBag(item)}
      >
        <Icon 
          name="add-shopping-cart" 
          type="material" 
          color="#ffffff" 
          size={20} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const handleAddToBag = (item) => {
    addToCart(item);
    // Implement add to cart functionality
    // You can use your CartContext here
  };

  const ListHeader = () => (
    <>
      <View style={styles.header}>
        <SearchBar
          placeholder={`Search ${category}`}
          lightTheme
          round
          containerStyle={styles.searchBar}
          inputContainerStyle={styles.searchInput}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>
      <View style={styles.filterContainer}>
  <TouchableOpacity 
    style={styles.filterButton}
    onPress={() => setShowFilters(!showFilters)}
  >
    <Icon name="filter-list" type="material" size={20} color="#666" />
    <Text style={styles.filterButtonText}>Filter</Text>
  </TouchableOpacity>
  
  <View style={styles.sortButtons}>
    <TouchableOpacity 
      style={[styles.sortButton, sortBy === 'newest' && styles.sortButtonActive]}
      onPress={() => setSortBy('newest')}
    >
      <Text style={styles.sortButtonText}>Newest</Text>
    </TouchableOpacity>
    <TouchableOpacity 
      style={[styles.sortButton, sortBy === 'price-low-high' && styles.sortButtonActive]}
      onPress={() => setSortBy('price-low-high')}
    >
      <Text style={styles.sortButtonText}>Price: Low to High</Text>
    </TouchableOpacity>
    <TouchableOpacity 
      style={[styles.sortButton, sortBy === 'price-high-low' && styles.sortButtonActive]}
      onPress={() => setSortBy('price-high-low')}
    >
      <Text style={styles.sortButtonText}>Price: High to Low</Text>
    </TouchableOpacity>
  </View>
</View>
      <FlatList
        data={banners}
        renderItem={renderBanner}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.bannerList}
      />
    </>
  );

  return (
    <>
      <HeaderPage />
      <View style={styles.container}>
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          numColumns={2}
          ListHeaderComponent={ListHeader}
          renderItem={renderProduct}
          contentContainerStyle={styles.productList}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Icon name="search-off" type="material" size={48} color="#999" />
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          )}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  searchBar: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 0,
  },
  searchInput: {
    backgroundColor: '#ececec',
    borderRadius: 25,
  },
  bannerList: {
    marginBottom: 20,
  },
  bannerContainer: {
    width: width - 30,
    marginHorizontal: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bannerImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  productList: {
    paddingBottom: 20,
  },
  productCard: {
    flex: 1,
    margin: 10,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    position: 'relative',
  },
  newBadgeContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6347',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    zIndex: 10,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  productImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    borderRadius: 15,
  },
  productName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  productPrice: {
    marginTop: 5,
    fontSize: 16,
    color: '#9c6da6',
    fontWeight: '600',
    textAlign: 'center',
  },
  addToBagButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#9c6da6',
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 15,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterButtonText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
  },
  sortButtons: {
    flexDirection: 'row',
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
  },
  sortButtonActive: {
    backgroundColor: 'yellow',
    color:"yellow"
  },
  sortButtonText: {
    fontSize: 12,
    color: '#666',
  },
});

export default CategoryPage;