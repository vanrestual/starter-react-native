import React from 'react';
import type {NavigatorScreenParams} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import Camera, {type CameraStackParamList} from './Camera';
import Home from '../views/Home';

export type RootStackParamList = {
  Home: undefined;
  Camera: NavigatorScreenParams<CameraStackParamList>;
};

export type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default () => (
  <RootStack.Navigator initialRouteName="Home">
    <RootStack.Screen component={Home} name="Home" />
    <RootStack.Screen
      component={Camera}
      name="Camera"
      options={{headerShown: false}}
    />
  </RootStack.Navigator>
);
