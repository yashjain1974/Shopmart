import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const products = [
  { id: '1', name: 'Casual Shirt', image: 'https://getketchadmin.getketch.com/product/8905745177197/660/HLSH013833_1.jpg' },
  { id: '2', name: 'Summer Dress', image: 'https://images-cdn.ubuy.co.in/6360014d9a4c66031277d697-summer-dresses-for-women-2022-womens.jpg' },
  { id: '3', name: 'Chino Pants', image: 'https://www.uniqlo.com/jp/ja/contents/feature/masterpiece/common/img/product/item_22_kv.jpg?240711' },
  // Add more products as needed
];

const ProductListModal = ({ isVisible, onClose }) => {
  const navigation = useNavigation();

  const handleProductPress = (product) => {
    onClose();
    navigation.navigate('ProductDetail', { product });
  };

  return (
    <View style={[styles.modal, isVisible ? styles.show : styles.hide]}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Products in this Reel</Text>
        <TouchableOpacity onPress={onClose}>
          <Icon name="close" type="material" color="#333" size={24} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.productItem} onPress={() => handleProductPress(item)}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Icon name="chevron-right" type="material" color="#888" size={24} />
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    color: '#333',
  },
});

export default ProductListModal;
