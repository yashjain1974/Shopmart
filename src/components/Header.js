import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';

const HeaderPage = () => {
  return (
    <LinearGradient
      colors={['#e9eaec', '#e9eaec']}
      style={styles.header}
    >
      <Text style={styles.headerTitle}>
        <Icon name="shopping-bag" type="feather" color="#010802" size={22} /> ShopMart
      </Text>
      <View style={styles.headerButtons}>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="shopping-cart" type="feather" color="#010802" />
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
});

export default HeaderPage;
