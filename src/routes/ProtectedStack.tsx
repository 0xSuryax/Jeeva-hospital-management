import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ScreenNames} from '../constants/ScreenNames';
import Home from '../screens/Home';

const Stack = createNativeStackNavigator();

const ProtectedStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={ScreenNames.HOME} component={Home} />
    </Stack.Navigator>
  );
};

export default ProtectedStack;
