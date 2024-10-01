import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useCart } from '../../store/CartContext';
import { Icon, Button } from 'react-native-elements';
const CartItem = ({ item, onIncrease, onDecrease }) => (
  <View style={styles.cartItem}>
    <Image source={{ uri: item.image }} style={styles.itemImage} />
    <View style={styles.itemDetails}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemColor}>Colour: {item.color} | Item #{item.id}</Text>
      <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      <View style={styles.quantityControl}>
        <TouchableOpacity onPress={() => onDecrease(item.id)} style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => onIncrease(item.id)} style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const ShoppingCartScreen = ({ navigation }) => {
  const { cartItems, addToCart, removeFromCart,updateQuantity } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Icon name="arrow-back" type="material" onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Shopping Cart</Text>
        <TouchableOpacity onPress={() => {/* Implement edit functionality */}}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.itemCount}>{cartItems.length} items</Text>
      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onIncrease={() => addToCart(item)}
            onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
          />
        )}
        keyExtractor={item => item.id.toString()}
      />
      <View style={styles.subtotalContainer}>
        <Text style={styles.subtotalText}>Sub total</Text>
        <Text style={styles.subtotalAmount}>${subtotal.toFixed(2)}</Text>
      </View>
      <Text style={styles.shippingNote}>(Total does not include shipping)</Text>
      <TouchableOpacity style={styles.checkoutButton}>
        <Text style={styles.checkoutButtonText}>Check out</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.paypalButton}>
        <Text style={styles.paypalButtonText}>Check out with PayPal</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.continueShopping}>Continue shopping</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop:40,
  },
  backButton: {
    fontSize: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  editButton: {
    color: '#007AFF',
  },
  itemCount: {
    marginBottom: 10,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  itemImage: {
    width: 100,
    height: 120,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemColor: {
    color: '#888',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
  },
  quantity: {
    paddingHorizontal: 15,
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  subtotalText: {
    fontSize: 16,
  },
  subtotalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  shippingNote: {
    color: '#888',
    marginBottom: 20,
  },
  checkoutButton: {
    backgroundColor: '#000',
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  paypalButton: {
    backgroundColor: 'blue',
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  paypalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  continueShopping: {
    textAlign: 'center',
    color: '#007AFF',
  },
});

export default ShoppingCartScreen;