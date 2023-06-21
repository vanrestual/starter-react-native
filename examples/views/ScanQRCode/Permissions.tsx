import React from 'react';
import {Button, Linking, StyleSheet, Text, View} from 'react-native';
import {Camera, CameraPermissionStatus} from 'react-native-vision-camera';
import type {PermissionsProps} from '../../routes/ScanQRCode';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    rowGap: 16,
  },
});

export default function Permissions(props: PermissionsProps) {
  const [cameraPermissionStatus, setCameraPermissionStatus] =
    React.useState<CameraPermissionStatus>('not-determined');
  const [microphonePermissionStatus, setMicrophonePermissionStatus] =
    React.useState<CameraPermissionStatus>('not-determined');

  const requestMicrophonePermission = React.useCallback(async () => {
    const permission = await Camera.requestMicrophonePermission();
    console.log(`Microphone permission status: ${permission}`);

    if (permission === 'denied') {
      await Linking.openSettings();
    }
    setMicrophonePermissionStatus(permission);
  }, []);

  const requestCameraPermission = React.useCallback(async () => {
    const permission = await Camera.requestCameraPermission();
    console.log(`Camera permission status: ${permission}`);

    if (permission === 'denied') {
      await Linking.openSettings();
    }
    setCameraPermissionStatus(permission);
  }, []);

  React.useEffect(() => {
    if (
      cameraPermissionStatus === 'authorized' &&
      microphonePermissionStatus === 'authorized'
    ) {
      props.navigation.replace('Camera');
    }
  }, [cameraPermissionStatus, microphonePermissionStatus, props.navigation]);

  return (
    <View style={styles.container}>
      {cameraPermissionStatus !== 'authorized' && (
        <React.Fragment>
          <Text>Camera permission</Text>
          <Button onPress={requestCameraPermission} title="Grant" />
        </React.Fragment>
      )}
      {microphonePermissionStatus !== 'authorized' && (
        <React.Fragment>
          <Text>Microphone permission</Text>
          <Button onPress={requestMicrophonePermission} title="Grant" />
        </React.Fragment>
      )}
    </View>
  );
}
