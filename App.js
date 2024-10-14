import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import MainNavigator from './src/components/MainNavigator';
import { CartProvider } from './src/store/CartContext';
import { AuthProvider } from './src/store/AuthContext';
const App = () => {
  return (
    <AuthProvider>
    <CartProvider>
    <SafeAreaView style={styles.container}>
      
      <MainNavigator />
    </SafeAreaView>
    </CartProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
