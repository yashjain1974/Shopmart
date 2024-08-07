import React, { useContext } from 'react';
import { Image, Text, Button, ScrollView, View, StyleSheet, Dimensions } from 'react-native';
import { Context } from '../../Context';

const { width: viewportWidth } = Dimensions.get('window');

const ItemDetailView = ({ route }) => {

    const { addItem } = useContext(Context);

    let item = route.params.item;
    //console.log(item);

    return (
        <ScrollView>
            <View>
                <Image style={styles.image} source={{ uri: item.image }}></Image>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.price}>₹ {item.price * 100}</Text>
            <Button title='Add Item To Cart' onPress={() => addItem(item)}></Button>
        </ScrollView>
    );
}

export default ItemDetailView;

const styles = StyleSheet.create({
    image: {
        height: 400,
        width: viewportWidth,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 5
    },
    price: {
        fontSize: 22,
        fontWeight: 'bold',
        padding: 10
    },
    description: {
        padding: 5
    }
})