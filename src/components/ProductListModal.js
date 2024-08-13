import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const products = [
  { id: '1', name: 'Casual Jacket', image: 'https://img.tatacliq.com/images/i7/1348Wx2000H/MP000000008944470_1348Wx2000H_202102281843001.jpeg' },
  { id: '2', name: 'Track pants', image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/af65bd9597514db3acd21db8ace43880_9366/adidas_Rekive_Woven_Track_Pants_Multicolor_HZ0730_21_model.jpg' },
  { id: '3', name: 'Bracelet', image: 'https://m.media-amazon.com/images/I/51b0BV5jwzL._AC_UY1100_.jpg' },
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
