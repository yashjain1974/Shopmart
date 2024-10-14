import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useAuth } from '../store/AuthContext';
import LoginScreen from '../Auth/LoginScreen';
import SignupScreen from '../Auth/SignupScreen';
import HomePage from './HomePage';
import ReelList from './Reel';
import HeaderPage from './Header';
import FooterPage from './Footer';
import CategoryPage from './CategoryPage';
import ProductDetailPage from './ProductDetailPage';
import ProfilePage from './ProfilePage';
import ContentUploadPage from './ContentUploadPage';
import ShoppingCartScreen from './Cart/ShoppingCartScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // You might want to create a LoadingScreen component
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="Reel" component={ReelList} />
          <Stack.Screen name="Category" component={CategoryPage} />
          <Stack.Screen name="ContentUpload" component={ContentUploadPage} />
          <Stack.Screen name="ProductDetail" component={ProductDetailPage} />
          {user ? (
            <>
              <Stack.Screen name="ProfilePage" component={ProfilePage} />
              
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
            </>
          )}
          <Stack.Screen name="ShoppingCart" component={ShoppingCartScreen} />
        </Stack.Navigator>
      </View>
      <FooterPage user={user} />
    </SafeAreaView>
  );
};

const MainNavigator = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default MainNavigator;