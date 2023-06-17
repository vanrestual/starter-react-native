import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import type {ProfileProps} from '../../routes/Settings';

const styles = StyleSheet.create({
  container: {alignItems: 'center', flex: 1, justifyContent: 'center'},
});

export default function Profile(props: ProfileProps) {
  return (
    <View style={styles.container}>
      <Text>Profile</Text>
      <Button onPress={() => props.navigation.goBack()} title="Go Back" />
    </View>
  );
}
