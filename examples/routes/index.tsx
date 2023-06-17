import React from 'react';
import type {NavigatorScreenParams} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import Products, {type ProductsStackParamList} from './Products';
import Settings, {type SettingsStackParamList} from './Settings';
import Home from '../views/Home';

export type RootStackParamList = {
  Home: undefined;
  Products: NavigatorScreenParams<ProductsStackParamList>;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};

export type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default () => (
  <RootStack.Navigator initialRouteName="Home">
    <RootStack.Screen component={Home} name="Home" />
    <RootStack.Screen
      component={Products}
      name="Products"
      options={{headerShown: false}}
    />
    <RootStack.Screen
      component={Settings}
      name="Settings"
      options={{headerShown: false}}
    />
  </RootStack.Navigator>
);
