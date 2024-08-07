import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

const HeaderFooterComponent = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>E-Commerce App</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="search" type="feather" color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="shopping-cart" type="feather" color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.contentText}>Your content here...</Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Icon name="home" type="feather" color="#fff" />
          <Text style={styles.footerButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Icon name="heart" type="feather" color="#fff" />
          <Text style={styles.footerButtonText}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Icon name="user" type="feather" color="#fff" />
          <Text style={styles.footerButtonText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Icon name="settings" type="feather" color="#fff" />
          <Text style={styles.footerButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6200ea',
    paddingHorizontal: 15,
    paddingVertical: 10,
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#6200ea',
    paddingVertical: 10,
  },
  footerButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default HeaderFooterComponent;
