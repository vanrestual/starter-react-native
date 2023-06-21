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
        onPress={() =>
          props.navigation.navigate('ScanQRCode', {screen: 'Index'})
        }
        title="Scan QR Code"
      />
    </View>
  );
}
