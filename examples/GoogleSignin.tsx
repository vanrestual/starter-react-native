/**
 * @format
 */

import React from 'react';
import {Button, SafeAreaView, StyleSheet, useColorScheme} from 'react-native';
import {
  GoogleSignin,
  NativeModuleError,
  statusCodes,
  User,
} from '@react-native-google-signin/google-signin';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    rowGap: 16,
  },
});

GoogleSignin.configure({
  iosClientId:
    '795545057578-oqldlev5c39jn0a7nghs8tt31roms860.apps.googleusercontent.com',
  offlineAccess: true,
  webClientId:
    '795545057578-vpg5vh0dk3k8sggb91756he8ohe1j8b0.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
});

export default function GoogleSigninScreen() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <Button
        title="Sign in with Google"
        onPress={async () => {
          try {
            await GoogleSignin.hasPlayServices();
            const userInfo: User = await GoogleSignin.signIn();
            console.log(userInfo);
          } catch (error) {
            if (
              (error as NativeModuleError).code ===
              statusCodes.SIGN_IN_CANCELLED
            ) {
              console.log(error);
            } else if (
              (error as NativeModuleError).code === statusCodes.IN_PROGRESS
            ) {
              // operation (e.g. sign in) is in progress already
              console.log(error);
            } else if (
              (error as NativeModuleError).code ===
              statusCodes.PLAY_SERVICES_NOT_AVAILABLE
            ) {
              console.log(error);
            } else {
              // some other error happened
              console.log(error);
            }
          }
        }}
      />
    </SafeAreaView>
  );
}
