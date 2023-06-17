import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {SettingsProps} from '../../routes/Settings';

const styles = StyleSheet.create({
  container: {alignItems: 'center', flex: 1, justifyContent: 'center'},
});

export default function Settings(props: SettingsProps) {
  return (
    <View style={styles.container}>
      <Text>Settings</Text>
      <Button
        title="Profile"
        onPress={() => props.navigation.navigate('Profile')}
      />
    </View>
  );
}
