import React from 'react';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import Camera from '../views/Camera';
import Media from '../views/Camera/Media';
import Permissions from '../views/Camera/Permissions';

import {
  Camera as VisionCamera,
  type CameraPermissionStatus,
} from 'react-native-vision-camera';

export type CameraStackParamList = {
  Index: undefined;
  Media: {path: string; type: 'photo' | 'video'};
  Permissions: undefined;
};

export type CameraProps = NativeStackScreenProps<CameraStackParamList, 'Index'>;
export type MediaProps = NativeStackScreenProps<CameraStackParamList, 'Media'>;
export type PermissionsProps = NativeStackScreenProps<
  CameraStackParamList,
  'Permissions'
>;

const CameraStack = createNativeStackNavigator<CameraStackParamList>();

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
    <CameraStack.Navigator
      initialRouteName={showPermissions ? 'Permissions' : 'Index'}
      screenOptions={{
        animationTypeForReplace: 'push',
        headerShown: false,
        statusBarStyle: 'dark',
      }}>
      <CameraStack.Screen component={Permissions} name="Permissions" />
      <CameraStack.Screen component={Camera} name="Index" />
      <CameraStack.Screen
        component={Media}
        name="Media"
        options={{
          animation: 'none',
          presentation: 'transparentModal',
        }}
      />
    </CameraStack.Navigator>
  );
};
