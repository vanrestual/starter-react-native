import React from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {HomeProps} from '../routes';

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
        title="Products"
        onPress={() => props.navigation.navigate('Products', {screen: 'Index'})}
      />
      <Button
        title="Settings"
        onPress={() => props.navigation.navigate('Settings', {screen: 'Index'})}
      />
    </View>
  );
}
