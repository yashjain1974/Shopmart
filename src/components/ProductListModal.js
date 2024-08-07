import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Button } from 'react-native';
import { Icon } from 'react-native-elements';

const products = [
  { id: '1', name: 'Product 1', image: 'https://via.placeholder.com/150' },
  { id: '2', name: 'Product 2', image: 'https://via.placeholder.com/150' },
  { id: '3', name: 'Product 3', image: 'https://via.placeholder.com/150' },
  // Add more products as needed
];

const ProductListModal = ({ isVisible, onClose }) => {
  return (
    <View style={[styles.modal, isVisible ? styles.show : styles.hide]}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Products in this Reel</Text>
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <Text style={styles.productName}>{item.name}</Text>
              <Button title="View" onPress={() => alert(`View details for ${item.name}`)} />
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
        <Button title="Close" onPress={onClose} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
  },
  show: {
    display: 'flex',
  },
  hide: {
    display: 'none',
  },
  modalContent: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  productName: {
    flex: 1,
  },
});

export default ProductListModal;
