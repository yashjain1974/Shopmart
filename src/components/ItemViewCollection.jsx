import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import ItemViewCard from './ItemViewCard';

var CARDS_PER_ROW = 2;

function ItemViewCollection({ navigation }) {

    const [dataSource, setDataSource] = useState(null);
    const [loaded, setLoaded] = useState(false);

    const onPress = ( item ) => {
        navigation.navigate('Detail', {
            item: item
        });
    };

    useEffect(() => {
        fetch('https://fakestoreapi.com/products')
            .then(res => res.json())
            .then((responseData) => {
                setDataSource(responseData);
                setLoaded(true);
            }).done();
    }, []);

    //console.log(dataSource);

    let groupItems = (items, itemsPerRow) => {
        //console.log('In groupitems' + items);
        let itemsGroups = [];
        let group = [];
        items.forEach((item) => {
            if (group.length === itemsPerRow) {
                itemsGroups.push(group);
                group = [item];
            } else {
                group.push(item);
            }
        });

        if (group.length > 0) {
            itemsGroups.push(group);
        }
        //console.log('In ItemGroups\n' + itemsGroups);
        return itemsGroups;
    };

    let renderGroup = ({ item }) => {
        const items = item.map((item, index) => {
            return renderItem(item, index);
        });
        return (
            <View style={styles.group}>
                {items}
            </View>
        );
    };

    let renderItem = (item, index) => {
        return <ItemViewCard item={item} onPress={onPress} key={index} />
    }

    if (loaded === true) {
        const groups = groupItems(dataSource, CARDS_PER_ROW);
        //console.log('Groups\n' + groups);
        return (
            <FlatList
                showsVerticalScrollIndicator={false}
                renderItem={renderGroup}
                data={groups}
                keyExtractor={(item, index) => index.toString()}
            />
        );
    }
    else {
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large' color='blue' />
            </View>
        );
    }  
}

var styles = StyleSheet.create({
    group: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default ItemViewCollection;