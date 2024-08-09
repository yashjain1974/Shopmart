import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SearchBar } from 'react-native-elements';
import HeaderPage from './Header';

const { width } = Dimensions.get('window');

const products = {
  Fashion: [
    { id: '1', name: 'Casual Shirt', price: '$29', image: 'https://getketchadmin.getketch.com/product/8905745177197/660/HLSH013833_1.jpg', isNew: true },
    { id: '2', name: 'Leather Bag', price: '$49', image: 'https://media.istockphoto.com/id/1271796113/photo/women-is-holding-handbag-near-luxury-car.jpg?s=612x612&w=0&k=20&c=-jtXLmexNgRa-eKqA1X8UJ8QYWhW7XgDiWNmzuuCHmM=', isNew: false },
    { id: '3', name: 'Summer Dress', price: '$79', image: 'https://images-cdn.ubuy.co.in/6360014d9a4c66031277d697-summer-dresses-for-women-2022-womens.jpg', isNew: false },
    { id: '4', name: 'Chino Pants', price: '$39', image: 'https://www.uniqlo.com/jp/ja/contents/feature/masterpiece/common/img/product/item_22_kv.jpg?240711', isNew: true },
    { id: '5', name: 'Denim Jacket', price: '$89', image: 'https://www.uniqlo.com/jp/ja/contents/feature/masterpiece/common/img/product/item_22_kv.jpg?240711', isNew: false },
    { id: '6', name: 'Sunglasses', price: '$19', image: 'https://5.imimg.com/data5/LM/NU/MY-36086933/men-sunglasses.jpg', isNew: true },
  ],
  // Add other categories and their products
};

const banners = [
  { id: '1', image: 'https://media.istockphoto.com/id/1271796113/photo/women-is-holding-handbag-near-luxury-car.jpg?s=612x612&w=0&k=20&c=-jtXLmexNgRa-eKqA1X8UJ8QYWhW7XgDiWNmzuuCHmM=' },
  { id: '2', image: 'https://i.imgur.com/UYiroysl.jpg' },
  { id: '3', image: 'https://macv.in/cdn/shop/collections/Sunglasses_banner_Desktop_1920_x_320.png?v=1691667927' },
];

const CategoryPage = ({ route }) => {
  const { category } = route.params;
  const [searchTerm, setSearchTerm] = useState('');
  const items = products[category] || [];
  const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const renderBanner = ({ item }) => (
    <View style={styles.bannerContainer}>
      <Image source={{ uri: item.image }} style={styles.bannerImage} />
    </View>
  );

  return (
    <>
      <HeaderPage />
      <View style={styles.container}>
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          numColumns={2}
          ListHeaderComponent={
            <>
              <View style={styles.header}>
                <SearchBar
                  placeholder="Search Fashion"
                  lightTheme
                  round
                  containerStyle={styles.searchBar}
                  inputContainerStyle={styles.searchInput}
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                />
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
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.productCard}>
              {item.isNew && <Text style={styles.newBadge}>NEW</Text>}
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price}</Text>
              <TouchableOpacity style={styles.addToBagButton}>
                <Text style={styles.addToBagButtonText}>ADD TO BAG</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  bannerList: {
    marginBottom: 15,
  },
  bannerContainer: {
    width: width - 30,
    marginHorizontal: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  productCard: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    position: 'relative',
  },
  newBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF6347',
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    zIndex: 10,
  },
  productImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  productName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    marginTop: 5,
    fontSize: 16,
    color: '#888',
  },
  addToBagButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: '#0071ce',
    borderRadius: 30,
  },
  addToBagButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CategoryPage;
