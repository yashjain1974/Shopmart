import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../store/AuthContext'; // Adjust the import path as needed

const Footer = () => {
  const navigation = useNavigation();
  const { user } = useAuth();

  const handleProfilePress = () => {
    if (user) {
      navigation.navigate('ProfilePage');
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <LinearGradient
      colors={['#e9eaec', '#e9eaec']}
      style={styles.footer}
    >
      <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Home')}>
        <Icon name="home" type="feather" color="#010802" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Reel')}>
        <Icon name="film" type="feather" color="#010802" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton} onPress={handleProfilePress}>
        <Icon name={user ? "user" : "log-in"} type="feather" color="#010802" />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: 13,
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