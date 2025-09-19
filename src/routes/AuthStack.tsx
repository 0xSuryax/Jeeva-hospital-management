import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ScreenNames} from '../constants/ScreenNames';
import Login from '../screens/Login';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={ScreenNames.LOGIN} component={Login} />
    </Stack.Navigator>
  );
};

export default AuthStack;
