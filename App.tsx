import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Routes from './examples/routes';

export default () => (
  <NavigationContainer>
    <Routes />
  </NavigationContainer>
);
