import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const Footer = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Home')}>
        <Icon name="home" type="feather" color="#fff" />
        <Text style={styles.footerButtonText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Reel')}>
        <Icon name="video" type="feather" color="#fff" />
        <Text style={styles.footerButtonText}>Reels</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Profile')}>
        <Icon name="user" type="feather" color="#fff" />
        <Text style={styles.footerButtonText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Settings')}>
        <Icon name="settings" type="feather" color="#fff" />
        <Text style={styles.footerButtonText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#000',
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

export default Footer;
