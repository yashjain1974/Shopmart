import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SearchBar } from 'react-native-elements';
import HeaderPage from './Header';
import { LinearGradient } from 'expo-linear-gradient';
const categories = ['Fashion','Departments', 'Grocery', 'Tech', 'Home', 'Deals', 'Electronics', 'Health & Beauty', 'Toys'];

const featuredBanners = [
  { id: '1', title: 'Gifts to Love', image: 'https://cdn.runrepeat.com/storage/gallery/buying_guide_primary/17/17-best-nike-running-shoes-15275034-960.jpg', subtitle: 'Shop Now' },
  { id: '2', title: 'Score Big', image: 'https://images.unsplash.com/photo-1561414927-6d86591d0c4f', subtitle: 'Shop All' },
  { id: '3', title: 'Get Outside', image: 'https://www.sennheiser.com/globalassets/digizuite/45735-en-hd_490_pro_product_shot_in_use_axis_audio_69.jpg/SennheiserFullWidth', subtitle: 'Shop Now' },
  { id: '4', title: 'Keep It Cool', image: 'https://shopperstore.in/public/uploads/all/2MDn6QkeObx8n9FiEsrvNGu3sNn7lmPQfQXtfw7N.jpg', subtitle: 'Shop Now' },
  { id: '5', title: 'Cook Up a Win', image: 'https://cdn.runrepeat.com/storage/gallery/buying_guide_primary/17/17-best-nike-running-shoes-15275034-960.jpg', subtitle: 'Shop Kitchen' },
];

const trendingProducts = [
  { id: '1', name: 'Wireless Headphones', price: 'Rs 19,999', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7DMu-7O2189abNd7fPJCirKtnE_NiO93s_g&s' },
  { id: '2', name: 'Smartphone', price: 'Rs 7,999', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvLeovcN03LjQG3TrGFDaO_LFKM2D33W0tmw&s' },
  { id: '3', name: 'Running Shoes', price: 'Rs 5,499', image: 'https://www.verywellfit.com/thmb/3kIfNjrvzQJRWEInF0zcPhkON5s=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/vwt-product-brooks-launch-10-jjuliao-14574-2716edc585704872b8cf3680187422cb.jpeg' },
  { id: '4', name: 'Smartwatch', price: 'Rs 2,399', image: 'https://hmadmin.hamleys.in/product/493174788/665/493174788-1.jpg' },
];

const HomePage = ({ navigation }) => {
  return (
    <>
      <HeaderPage />
      <View style={styles.container}>
      <LinearGradient
      colors={['#e9eaec', '#e9eaec']}
      style={styles.header}
    >
        
          <SearchBar
            placeholder="Search Products"
            lightTheme
            round
            containerStyle={styles.searchBar}
            inputContainerStyle={styles.searchInput}
          />
       
        </LinearGradient>

        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={styles.tab}
                onPress={() => navigation.navigate('Category', { category })}
              >
                <Text style={styles.tabText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView style={styles.scrollContainer}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.carouselContainer}>
            {featuredBanners.map((banner) => (
              <TouchableOpacity key={banner.id} style={styles.carouselItem}>
                <Image source={{ uri: banner.image }} style={styles.carouselImage} />
                <View style={styles.carouselTextContainer}>
                  <Text style={styles.carouselTitle}>{banner.title}</Text>
                  <Text style={styles.carouselSubtitle}>{banner.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <Text style={styles.sectionTitle}>Trending Products</Text>
          <View style={styles.productGrid}>
            {trendingProducts.map((product) => (
              <TouchableOpacity key={product.id} style={styles.productContainer}>
                <Image source={{ uri: product.image }} style={styles.productImage} />
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>{product.price}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.sectionTitle}>More to Explore</Text>
          <View style={styles.bannerGrid}>
            {featuredBanners.map((banner) => (
              <TouchableOpacity key={banner.id} style={styles.bannerContainer}>
                <Image source={{ uri: banner.image }} style={styles.bannerImage} />
                <View style={styles.bannerTextContainer}>
                  <Text style={styles.bannerTitle}>{banner.title}</Text>
                  <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 15,
   
  },
  searchBar: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  tabsContainer: {
    paddingVertical: 10,
    backgroundColor: '#f1f1f1',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    marginHorizontal: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#e9eaec',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#9c6da6',
  },
  tabText: {
    fontSize: 17,
    color: '#010802'
  },
  scrollContainer: {
    padding: 15,
    backgroundColor: '#f4f4f4',
  },
  carouselContainer: {
    marginBottom: 15,
  },
  carouselItem: {
    width: 351,
    height: 200,
    marginRight: 9,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  carouselTextContainer: {
    position: 'absolute',
    bottom: 15,
    left: 15,
  },
  carouselTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  carouselSubtitle: {
    fontSize: 16,
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  productContainer: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  productImage: {
    width: '100%',
    height: 120,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 16,
    color: '#9c6da6',
    fontWeight: 'bold',
  },
  bannerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bannerContainer: {
    height: 200,
    width: '48%',
    marginBottom: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerTextContainer: {
    position: 'absolute',
    bottom: 15,
    left: 15,
  },
  bannerTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#fff',
  },
});

export default HomePage;
