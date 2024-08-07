import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ItemViewCollection from '../components/ItemViewCollection';
import ItemDetailView from '../components/ItemDetailView';

const Stack = createStackNavigator();

function HomeTab() {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator>
                <Stack.Screen
                    name='Home'
                    component={ItemViewCollection}
                />
                <Stack.Screen
                    name='Detail'
                    options={
                        ({ route }) => {
                            
                        }}
                    component={ItemDetailView}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default HomeTab;