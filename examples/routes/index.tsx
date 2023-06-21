import React from 'react';
import type {NavigatorScreenParams} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import ScanQRCode, {type ScanQRCodeStackParamList} from './ScanQRCode';
import Home from '../views/Home';

export type RootStackParamList = {
  Home: undefined;
  ScanQRCode: NavigatorScreenParams<ScanQRCodeStackParamList>;
};

export type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default () => (
  <RootStack.Navigator initialRouteName="Home">
    <RootStack.Screen component={Home} name="Home" />
    <RootStack.Screen
      component={ScanQRCode}
      name="ScanQRCode"
      options={{headerShown: false}}
    />
  </RootStack.Navigator>
);
