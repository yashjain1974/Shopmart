import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

const HeaderPage = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>ShopMart App</Text>
      <View style={styles.headerButtons}>
        {/* <TouchableOpacity style={styles.headerButton}>
          <Icon name="search" type="feather" color="#fff" />
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="shopping-cart" type="feather" color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal:40,
    paddingTop:60,
    paddingBottom:20,
    
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 15,
  },
});

export default HeaderPage;
