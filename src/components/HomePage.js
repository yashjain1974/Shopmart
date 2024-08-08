import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SearchBar } from 'react-native-elements';
import Carousel from './Carousel';
import HeaderPage from './Header';

const categories = ['Departments', 'Grocery', 'Tech', 'Fashion', 'Home'];

const featuredBanners = [
  { id: '1', title: 'Gifts to love', image: 'https://cdn.runrepeat.com/storage/gallery/buying_guide_primary/17/17-best-nike-running-shoes-15275034-960.jpg', subtitle: 'Shop now' },
  { id: '2', title: 'Score big', image: 'https://images.unsplash.com/photo-1561414927-6d86591d0c4f', subtitle: 'Shop all' },
  { id: '3', title: 'Get outside', image: 'https://www.sennheiser.com/globalassets/digizuite/45735-en-hd_490_pro_product_shot_in_use_axis_audio_69.jpg/SennheiserFullWidth', subtitle: 'Shop now' },
  { id: '4', title: 'Keep it cool', image: 'https://shopperstore.in/public/uploads/all/2MDn6QkeObx8n9FiEsrvNGu3sNn7lmPQfQXtfw7N.jpg', subtitle: 'Shop now' },
  { id: '5', title: 'Cook up a win', image: 'https://cdn.runrepeat.com/storage/gallery/buying_guide_primary/17/17-best-nike-running-shoes-15275034-960.jpg', subtitle: 'Shop kitchen' },
];

const HomePage = ({ navigation }) => {
  return (
    <>
      <HeaderPage />
      <View style={styles.container}>
        <View style={styles.header}>
          <SearchBar
            placeholder="Search Walmart"
            lightTheme
            round
            containerStyle={styles.searchBar}
            inputContainerStyle={styles.searchInput}
          />
        </View>

        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity key={category} style={styles.tab}>
                <Text style={styles.tabText}>{category}</Text>
              </TouchableOpacity>
            ))}
           
          </ScrollView>
        </View>

        <Carousel data={featuredBanners.slice(0, 3)} />

        <ScrollView style={styles.scrollContainer}>
        
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 6,
    paddingHorizontal: 15,
    backgroundColor: 'black',
  },
  searchBar: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  tabsContainer: {
    paddingVertical: 10,
    backgroundColor: 'black',
  },
  tab: {
    marginHorizontal: 15,
  },
  tabText: {
    fontSize: 16,
    color: '#fff',
  },
  scrollContainer: {
    padding: 15,
  },
  bannerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bannerContainer: {
    height: 259,
    width: '48%',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: 259,
  },
  bannerTextContainer: {
    position: 'absolute',
    bottom: 15,
    left: 15,
  },
  bannerTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#fff',
  },
});

export default HomePage;
