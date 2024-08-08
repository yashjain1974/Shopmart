import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import HeaderPage from './Header';

const data = {
  categories: [
    {
      name: 'Clothes',
      items: [
        { id: 1, name: 'T-Shirt', price: '$20', image: require('../../assets/myT.jpg') },
        { id: 2, name: 'Jeans', price: '$40', image: require('../../assets/myT.jpg') },
        { id: 3, name: 'Jacket', price: '$60', image: require('../../assets/myT.jpg') },
      ],
    },
    {
      name: 'Accessories',
      items: [
        { id: 4, name: 'Watch', price: '$50', image: require('../../assets/myT.jpg') },
        { id: 5, name: 'Sunglasses', price: '$30', image: require('../../assets/myT.jpg') },
        { id: 6, name: 'Hat', price: '$25', image: require('../../assets/myT.jpg') },
      ],
    },
    {
      name: 'Footwear',
      items: [
        { id: 7, name: 'Sneakers', price: '$80', image: require('../../assets/myT.jpg') },
        { id: 8, name: 'Sandals', price: '$35', image: require('../../assets/myT.jpg') },
      ],
    },
  ],
};

const HomePage = () => {
  return (
    <><HeaderPage />
        
    <ScrollView style={styles.container}>
      {data.categories.map((category, index) => (
        <View key={index} style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>{category.name}</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {category.items.map((item) => (
              <Card key={item.id} containerStyle={styles.card}>
                <Image source={item.image} style={styles.image} />
                <View style={styles.cardContent}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>{item.price}</Text>
                  <Button
                    icon={<Icon name="shopping-cart" color="#ffffff" />}
                    buttonStyle={styles.button}
                    title="Add to Cart"
                  />
                </View>
              </Card>
            ))}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    width: 200,
    marginHorizontal: 10,
    padding: 0,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  itemPrice: {
    fontSize: 14,
    textAlign: 'center',
    color: '#888',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#6200ea',
    borderRadius: 5,
  },
});

export default HomePage;
