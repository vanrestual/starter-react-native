import React from 'react';
import {
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
  type ImageLoadEventData,
  type NativeSyntheticEvent,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import type {MediaProps} from '../../routes/Camera';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {useIsFocused} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Video, {type LoadError, type OnLoadData} from 'react-native-video';
import StatusBarBlurBackground from './Partials/StatusBarBlurBackground';
import useAppState from '../../hooks/AppState';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    rowGap: 16,
  },
  closeButton: {
    position: 'absolute',
    width: 40,
    height: 40,
  },
  saveButton: {
    position: 'absolute',
    width: 40,
    height: 40,
  },
  icon: {
    textShadowColor: 'black',
    textShadowOffset: {
      height: 0,
      width: 0,
    },
    textShadowRadius: 1,
  },
});

const requestSavePermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return true;
  }

  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
  if (permission == null) {
    return false;
  }
  let hasPermission = await PermissionsAndroid.check(permission);
  if (!hasPermission) {
    const permissionRequestResult = await PermissionsAndroid.request(
      permission,
    );
    hasPermission = permissionRequestResult === 'granted';
  }
  return hasPermission;
};

const isVideoOnLoadEvent = (
  event: OnLoadData | NativeSyntheticEvent<ImageLoadEventData>,
): event is OnLoadData => 'duration' in event && 'naturalSize' in event;

export default function Media(props: MediaProps) {
  const appState = useAppState();
  const isScreenFocused = useIsFocused();
  const safeAreaInsets = useSafeAreaInsets();
  const isVideoPaused = appState !== 'active' || !isScreenFocused;

  const [hasMediaLoaded, setHasMediaLoaded] = React.useState(false);
  const [savingState, setSavingState] = React.useState<
    'none' | 'saving' | 'saved'
  >('none');

  const onMediaLoad = React.useCallback(
    (event: OnLoadData | NativeSyntheticEvent<ImageLoadEventData>) => {
      if (isVideoOnLoadEvent(event)) {
        console.log(
          `Video loaded. Size: ${event.naturalSize.width}x${event.naturalSize.height} (${event.naturalSize.orientation}, ${event.duration} seconds)`,
        );
      } else {
        console.log(
          `Image loaded. Size: ${event.nativeEvent.source.width}x${event.nativeEvent.source.height}`,
        );
      }
    },
    [],
  );

  const onMediaLoadEnd = React.useCallback(() => {
    console.log('media has loaded.');
    setHasMediaLoaded(true);
  }, []);

  const onMediaLoadError = React.useCallback((error: LoadError) => {
    console.log(`failed to load media: ${JSON.stringify(error)}`);
  }, []);

  const onSavePressed = React.useCallback(async () => {
    try {
      setSavingState('saving');
      const hasPermission = await requestSavePermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission denied!',
          'Vision Camera does not have permission to save the media to your camera roll.',
        );
        return;
      }
      await CameraRoll.save(`file://${props.route.params.path}`, {
        type: props.route.params.type,
      });
      setSavingState('saved');
    } catch (e) {
      const message = e instanceof Error ? e.message : JSON.stringify(e);
      setSavingState('none');
      Alert.alert(
        'Failed to save!',
        `An unexpected error occured while trying to save your ${props.route.params.type}. ${message}`,
      );
    }
  }, [props.route.params.path, props.route.params.type]);

  const screenStyle = React.useMemo(
    () => ({opacity: hasMediaLoaded ? 1 : 0}),
    [hasMediaLoaded],
  );

  const source = React.useMemo(
    () => ({uri: `file://${props.route.params.path}`}),
    [props.route.params.path],
  );

  return (
    <View style={[styles.container, screenStyle]}>
      {props.route.params.type === 'photo' && (
        <Image
          onLoad={onMediaLoad}
          onLoadEnd={onMediaLoadEnd}
          source={source}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      )}
      {props.route.params.type === 'video' && (
        <Video
          allowsExternalPlayback={false}
          automaticallyWaitsToMinimizeStalling={false}
          controls={false}
          disableFocus={true}
          ignoreSilentSwitch="ignore"
          onError={onMediaLoadError}
          onLoad={onMediaLoad}
          onReadyForDisplay={onMediaLoadEnd}
          paused={isVideoPaused}
          playWhenInactive={true}
          posterResizeMode="cover"
          repeat={true}
          resizeMode="cover"
          source={source}
          style={StyleSheet.absoluteFill}
          useTextureView={false}
        />
      )}
      <Pressable
        onPress={props.navigation.goBack}
        style={[
          styles.closeButton,
          {left: safeAreaInsets.left, top: safeAreaInsets.top},
        ]}>
        <IonIcon name="close" size={35} color="white" style={styles.icon} />
      </Pressable>
      <Pressable
        disabled={savingState !== 'none'}
        onPress={onSavePressed}
        style={[
          styles.saveButton,
          {
            bottom: safeAreaInsets.bottom,
            left: safeAreaInsets.left,
          },
        ]}>
        {savingState === 'none' && (
          <IonIcon
            color="white"
            name="download"
            size={35}
            style={styles.icon}
          />
        )}
        {savingState === 'saved' && (
          <IonIcon
            color="white"
            name="checkmark"
            size={35}
            style={styles.icon}
          />
        )}
        {savingState === 'saving' && <ActivityIndicator color="white" />}
      </Pressable>
      <StatusBarBlurBackground />
    </View>
  );
}
