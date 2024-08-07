import React from 'react';
import { Image, View, StyleSheet, Text, Pressable } from 'react-native';

const ItemViewCard = ({ item, onPress }) => {
    return (
        <Pressable onPress={() => onPress(item)}>
            <View style={styles.container}>
                <Image style={styles.image} source={{uri: item.image}}>
                </Image>
                <Text style={styles.titleText}>{item.title}</Text>
                <Text style={styles.text}>₹ {item.price * 100}</Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 160,
        height: 250,
        elevation: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 5,
        margin: 5,
        justifyContent: 'flex-start',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff',
        backgroundColor: '#fff'
    },
    titleText: {
        fontSize: 16,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    image: {
        width: 140,
        height: 140,
        borderColor: "#000000",
        borderWidth: 2,
        borderRadius: 5
    }
});

export default ItemViewCard;