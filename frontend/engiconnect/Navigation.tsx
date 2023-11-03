import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import MainScreen from './MainScreen';
import ReadScreen from './ReadScreen';
import WriteScreen from './WriteScreen';
import ProfileScreen from './ProfileScreen';

const Stack = createNativeStackNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Read" component={ReadScreen} />
        <Stack.Screen name="Write" component={WriteScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;