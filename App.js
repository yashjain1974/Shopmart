import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import MainNavigator from './src/components/MainNavigator';
import { CartProvider } from './src/store/CartContext';
const App = () => {
  return (
    <CartProvider>
    <SafeAreaView style={styles.container}>
      
      <MainNavigator />
    </SafeAreaView>
    </CartProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
