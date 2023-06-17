import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {ProfileProps} from '../../routes/Settings';

const styles = StyleSheet.create({
  container: {alignItems: 'center', flex: 1, justifyContent: 'center'},
});

export default function Profile(props: ProfileProps) {
  return (
    <View style={styles.container}>
      <Text>Profile</Text>
      <Button title="Go Back" onPress={() => props.navigation.goBack()} />
    </View>
  );
}
