import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  // Importing icons

export default function App() {
  const [number, setNumber] = useState(0);

  const increment = () => {
    setNumber(number + 1);
  };

  const decrement = () => {
    setNumber(number - 2);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>App</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.number}>{number}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={increment}>
            <Ionicons name="add-circle" size={24} color="white" />
            <Text style={styles.buttonText}>Increment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={decrement}>
            <Ionicons name="remove-circle" size={24} color="white" />
            <Text style={styles.buttonText}>Decr</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="home" size={24} color="white" />
          <Text style={styles.footerButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="settings" size={24} color="white" />
          <Text style={styles.footerButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#6200ee',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    fontSize: 48,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    color: 'white',
    marginLeft: 30,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#6200ee',
    padding: 10,
  },
  footerButton: {
    alignItems: 'center',
  },
  footerButtonText: {
    color: 'white',
  },
});
