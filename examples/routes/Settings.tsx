import React from 'react';
import {
  createStackNavigator,
  type StackScreenProps,
} from '@react-navigation/stack';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import Settings from '../views/Settings';
import Profile from '../views/Settings/Profile';

export type SettingsStackParamList = {
  Index: undefined;
  Profile: undefined;
};

export type ProfileProps = StackScreenProps<SettingsStackParamList, 'Profile'>;
export type SettingsProps = NativeStackScreenProps<
  SettingsStackParamList,
  'Index'
>;

const SettingsStack = createStackNavigator<SettingsStackParamList>();

export default () => (
  <SettingsStack.Navigator initialRouteName="Index">
    <SettingsStack.Screen
      component={Settings}
      name="Index"
      options={{title: 'Settings'}}
    />
    <SettingsStack.Screen component={Profile} name="Profile" />
  </SettingsStack.Navigator>
);
