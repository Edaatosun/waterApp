import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import React from 'react'
import Login from '../screens/login';
import SignUp from '../screens/signUp';
import Goals from '../screens/goals';
import DrawerMenu from '../components/drawerMenu';
import 'react-native-gesture-handler';
import Home from '../screens/home';

const Stack = createNativeStackNavigator();

export default function Index() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Goals" component={Goals} />
        <Stack.Screen name="Drawer" component={DrawerMenu} /> 

      </Stack.Navigator>

    </NavigationContainer>
  )
}