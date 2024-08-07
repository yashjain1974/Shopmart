import React, { useContext } from 'react';
import { Text, View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Context } from '../../Context';
import { ListItem, Avatar, Button } from 'react-native-elements';
function CartTab({ navigation }) {
    const { getCart, emptyCart, removeItem } = useContext(Context);

    let data = getCart();

    const getTotal = () => {
        let total = 0;
        data.forEach(item => {
            total += item.price * 100;
        });

        return total;
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity>
            <ListItem bottomDivider>
                <Avatar source={{ uri: item.image }} />
                <ListItem.Content>
                    <ListItem.Title>{item.title}</ListItem.Title>
                    <ListItem.Subtitle>₹ {item.price * 100}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
            renderItem={renderItem}
            data={data}
            keyExtractor={(item, index) => index.toString()}
        />
        <Button title='Checkout' style={styles.button} onPress={() => emptyCart()}>₹ {getTotal()}</Button>
        </View>
        
    );
}

export default CartTab;

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        justifyContent: 'flex-end',
        display: 'flex',
        bottom: 0
    },
    container: {
        flexDirection: 'column',
        flex: 1
    }
})