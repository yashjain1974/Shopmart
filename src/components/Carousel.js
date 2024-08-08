import React from 'react';
import { View, Image, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

const { width: viewportWidth } = Dimensions.get('window');

const Carousel = ({ data }) => {
  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.carouselContainer}
    >
      {data.map((item) => (
        <View key={item.id} style={styles.carouselItem}>
          <Image source={{ uri: item.image }} style={styles.carouselImage} />
          <View style={styles.carouselTextContainer}>
            <Text style={styles.carouselTitle}>{item.title}</Text>
            <Text style={styles.carouselSubtitle}>{item.subtitle}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    alignItems: 'center',
  },
  carouselItem: {
    width: viewportWidth,
    height: 300,
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 0,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  carouselTextContainer: {
    position: 'absolute',
    bottom: 75,
    left: 15,
  },
  carouselTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  carouselSubtitle: {
    fontSize: 16,
    color: '#fff',
  },
});

export default Carousel;
