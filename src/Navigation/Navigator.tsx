import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../Screens/HomeScreen/HomeScreen';
import { AddUserScreen } from '../Screens/AddUser/AddUserScreen';

export type RootStackParamList = {
  Home: any;
  AddUser: any;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="Home"
          component={HomeScreen} 
        />
        <Stack.Screen 
          name="AddUser"
          component={AddUserScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
