import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SearchBar } from 'react-native-elements';
import HeaderPage from './Header';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';

const { width } = Dimensions.get('window');

const products = {
  Fashion: [
    { id: '1', name: 'Casual Shirt', price: 'Rs 2,999', image: 'https://getketchadmin.getketch.com/product/8905745177197/660/HLSH013833_1.jpg', isNew: true },
    { id: '2', name: 'Leather Bag', price: 'Rs 4,999', image: 'https://media.istockphoto.com/id/1271796113/photo/women-is-holding-handbag-near-luxury-car.jpg?s=612x612&w=0&k=20&c=-jtXLmexNgRa-eKqA1X8UJ8QYWhW7XgDiWNmzuuCHmM=', isNew: false },
    { id: '3', name: 'Summer Dress', price: 'Rs 799', image: 'https://images-cdn.ubuy.co.in/6360014d9a4c66031277d697-summer-dresses-for-women-2022-womens.jpg', isNew: false },
    { id: '4', name: 'Chino Pants', price: 'Rs 1,029', image: 'https://www.uniqlo.com/jp/ja/contents/feature/masterpiece/common/img/product/item_22_kv.jpg?240711', isNew: true },
    { id: '5', name: 'Denim Jacket', price: 'Rs 4,560', image: 'https://www.uniqlo.com/jp/ja/contents/feature/masterpiece/common/img/product/item_22_kv.jpg?240711', isNew: false },
    { id: '6', name: 'Sunglasses', price: 'Rs 1,299', image: 'https://5.imimg.com/data5/LM/NU/MY-36086933/men-sunglasses.jpg', isNew: true },
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
  const navigation = useNavigation();

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
                  placeholder={`Search ${category}`}
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
            <TouchableOpacity
              style={styles.productCard}
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
            >
              {item.isNew && (
                <View style={styles.newBadgeContainer}>
                  <Icon name="star" type="material" color="#FFD700" size={14} />
                  <Text style={styles.newBadgeText}>NEW</Text>
                </View>
              )}
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  productPrice: {
    marginTop: 5,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  addToBagButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 25,
    backgroundColor: '#0071ce',
    borderRadius: 25,
  },
  addToBagButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CategoryPage;
