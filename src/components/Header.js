import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../store/CartContext';

const HeaderPage = () => {
  const navigation = useNavigation();
  const { getCartItemsCount } = useCart();

  return (
    <LinearGradient
      colors={['#e9eaec', '#e9eaec']}
      style={styles.header}
    >
      <Text style={styles.headerTitle}>
        <Icon name="shopping-bag" type="feather" color="#010802" size={22} /> ShopMart
      </Text>
      <View style={styles.headerButtons}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.navigate('ShoppingCart')} // Assume you have a 'Cart' screen
        >
          <Icon name="shopping-cart" type="feather" color="#010802" />
          {getCartItemsCount() > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{getCartItemsCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    color: '#010802',
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 15,
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default HeaderPage;
