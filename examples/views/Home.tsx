import React from 'react';
import {Button, StyleSheet, View} from 'react-native';
import type {HomeProps} from '../routes';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    rowGap: 16,
  },
});

export default function Home(props: HomeProps) {
  return (
    <View style={styles.container}>
      <Button
        onPress={() => props.navigation.navigate('Camera', {screen: 'Index'})}
        title="Camera"
      />
      <Button
        onPress={() => props.navigation.navigate('Products', {screen: 'Index'})}
        title="Products"
      />
      <Button
        onPress={() => props.navigation.navigate('Settings', {screen: 'Index'})}
        title="Settings"
      />
    </View>
  );
}
