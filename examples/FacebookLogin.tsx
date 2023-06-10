/**
 * @format
 */

import React from 'react';
import {
  Button,
  Platform,
  SafeAreaView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  AccessToken,
  AuthenticationToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
  Profile,
} from 'react-native-fbsdk-next';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    rowGap: 16,
  },
});

export default function FacebookLogin(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <Button
        onPress={() => {
          LoginManager.logInWithPermissions(['email', 'public_profile']).then(
            async result => {
              if (result.isCancelled) {
                console.log('Login cancelled');
              } else {
                console.log(
                  'Permissions: ' + result.grantedPermissions?.toString(),
                );
                if (Platform.OS === 'ios') {
                  AuthenticationToken.getAuthenticationTokenIOS().then(data => {
                    console.log(
                      'Authentication Token: ' + data?.authenticationToken,
                    );
                    Profile.getCurrentProfile().then(profile => {
                      if (profile) {
                        console.log(profile);
                      }
                    });
                  });
                } else {
                  AccessToken.getCurrentAccessToken().then(async data => {
                    console.log(
                      'Access Token: ' + data?.accessToken.toString(),
                    );
                    new GraphRequestManager()
                      .addRequest(
                        new GraphRequest(
                          '/me',
                          {
                            httpMethod: 'GET',
                            version: 'v15.0',
                            parameters: {
                              fields: {
                                string:
                                  'email,first_name,last_name,middle_name,name,picture',
                              },
                            },
                          },
                          (error, profile) => {
                            if (error) {
                              console.log(
                                'Error fetching data: ' + error.toString(),
                              );
                            } else {
                              console.log(profile);
                            }
                          },
                        ),
                      )
                      .start();
                  });
                }
              }
            },
            error => {
              console.log('Error: ' + error);
            },
          );
        }}
        title="Log in with Facebook"
      />
    </SafeAreaView>
  );
}
