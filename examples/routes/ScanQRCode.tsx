import React from 'react';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import Camera from '../views/ScanQRCode/Camera';
import Media from '../views/ScanQRCode/Media';
import Permissions from '../views/ScanQRCode/Permissions';

import {
  Camera as VisionCamera,
  type CameraPermissionStatus,
} from 'react-native-vision-camera';

export type ScanQRCodeStackParamList = {
  Camera: undefined;
  Media: {path: string; type: 'photo' | 'video'};
  Permissions: undefined;
};

export type CameraProps = NativeStackScreenProps<
  ScanQRCodeStackParamList,
  'Camera'
>;
export type MediaProps = NativeStackScreenProps<
  ScanQRCodeStackParamList,
  'Media'
>;
export type PermissionsProps = NativeStackScreenProps<
  ScanQRCodeStackParamList,
  'Permissions'
>;

const ScanQRCodeStack = createNativeStackNavigator<ScanQRCodeStackParamList>();

export default () => {
  const [cameraPermission, setCameraPermission] =
    React.useState<CameraPermissionStatus>();
  const [microphonePermission, setMicrophonePermission] =
    React.useState<CameraPermissionStatus>();

  React.useEffect(() => {
    VisionCamera.getCameraPermissionStatus().then(setCameraPermission);
    VisionCamera.getMicrophonePermissionStatus().then(setMicrophonePermission);
  }, []);

  console.log(
    `Re-rendering Navigator. Camera: ${cameraPermission} | Microphone: ${microphonePermission}`,
  );

  if (cameraPermission == null || microphonePermission == null) {
    // still loading
    return null;
  }

  const showPermissions =
    cameraPermission !== 'authorized' ||
    microphonePermission === 'not-determined';

  return (
    <ScanQRCodeStack.Navigator
      initialRouteName={showPermissions ? 'Permissions' : 'Camera'}
      screenOptions={{
        animationTypeForReplace: 'push',
        headerShown: false,
        statusBarStyle: 'dark',
      }}>
      <ScanQRCodeStack.Screen component={Permissions} name="Permissions" />
      <ScanQRCodeStack.Screen component={Camera} name="Camera" />
      <ScanQRCodeStack.Screen
        component={Media}
        name="Media"
        options={{
          animation: 'none',
          presentation: 'transparentModal',
        }}
      />
    </ScanQRCodeStack.Navigator>
  );
};
