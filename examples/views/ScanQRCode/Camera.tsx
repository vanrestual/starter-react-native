import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Reanimated from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Camera as VisionCamera,
  useFrameProcessor,
  type FrameProcessorPerformanceSuggestion,
  type PhotoFile,
  type VideoFile,
} from 'react-native-vision-camera';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/Ionicons';
import useCamera, {examplePlugin} from '../../hooks/Camera';
import type {CameraProps} from '../../routes/ScanQRCode';
import CaptureButton from './Partials/CaptureButton';
import StatusBarBlurBackground from './Partials/StatusBarBlurBackground';

const styles = StyleSheet.create({
  container: {flex: 1},
  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(140, 140, 140, 0.25)',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    marginBottom: 20,
    width: 40,
  },
  rightButtonRow: {
    position: 'absolute',
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
});

const ReanimatedCamera = Reanimated.createAnimatedComponent(VisionCamera);

Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

export default function Camera(props: CameraProps) {
  const safeAreaInsets = useSafeAreaInsets();
  const camera = React.useRef<VisionCamera | any>(null);

  const {
    animatedProps,
    audio,
    canToggleNightMode,
    device,
    enableHdr,
    enableNightMode,
    flash,
    format,
    fps,
    is60Fps,
    isActive,
    isCameraInitialized,
    maxZoom,
    minZoom,
    onDoubleTap,
    onError,
    onFlashPressed,
    onFlipCameraPressed,
    onInitialized,
    onPinchGesture,
    setIs60Fps,
    setEnableHdr,
    setEnableNightMode,
    setIsPressingButton,
    supports60Fps,
    supportsCameraFlipping,
    supportsFlash,
    supportsHdr,
    zoom,
  } = useCamera();

  const onMediaCaptured = React.useCallback(
    (media: PhotoFile | VideoFile, type: 'photo' | 'video') => {
      console.log(`Media captured! ${JSON.stringify(media)}`);
      props.navigation.navigate('Media', {path: media.path, type});
    },
    [props.navigation],
  );

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const values = examplePlugin(frame);
    console.log(`Return Values: ${JSON.stringify(values)}`);
  }, []);

  const onFrameProcessorSuggestionAvailable = React.useCallback(
    (suggestion: FrameProcessorPerformanceSuggestion) => {
      console.log(
        `Suggestion available! ${suggestion.type}: Can do ${suggestion.suggestedFrameProcessorFps} FPS`,
      );
    },
    [],
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      {device != null && (
        <PinchGestureHandler onGestureEvent={onPinchGesture} enabled={isActive}>
          <Reanimated.View style={StyleSheet.absoluteFill}>
            <TapGestureHandler onEnded={onDoubleTap} numberOfTaps={2}>
              <ReanimatedCamera
                animatedProps={animatedProps}
                audio={audio}
                device={device}
                enableZoomGesture={false}
                format={format}
                fps={fps}
                frameProcessor={
                  device.supportsParallelVideoProcessing
                    ? frameProcessor
                    : undefined
                }
                frameProcessorFps={1}
                hdr={enableHdr}
                isActive={isActive}
                lowLightBoost={device.supportsLowLightBoost && enableNightMode}
                orientation="portrait"
                onError={onError}
                onFrameProcessorPerformanceSuggestionAvailable={
                  onFrameProcessorSuggestionAvailable
                }
                onInitialized={onInitialized}
                photo={true}
                ref={camera}
                style={StyleSheet.absoluteFill}
                video={true}
              />
            </TapGestureHandler>
          </Reanimated.View>
        </PinchGestureHandler>
      )}
      <CaptureButton
        camera={camera}
        cameraZoom={zoom}
        enabled={isCameraInitialized && isActive}
        flash={supportsFlash ? flash : 'off'}
        maxZoom={maxZoom}
        minZoom={minZoom}
        onMediaCaptured={onMediaCaptured}
        setIsPressingButton={setIsPressingButton}
      />
      <StatusBarBlurBackground />
      <View
        style={[
          styles.rightButtonRow,
          {
            right: safeAreaInsets.right,
            top: safeAreaInsets.top,
          },
        ]}>
        {supportsCameraFlipping ? (
          <Pressable onPress={onFlipCameraPressed} style={styles.button}>
            <IonIcon color="white" name="camera-reverse" size={24} />
          </Pressable>
        ) : null}
        {supportsFlash ? (
          <Pressable onPress={onFlashPressed} style={styles.button}>
            <IonIcon
              color="white"
              name={flash === 'on' ? 'flash' : 'flash-off'}
              size={24}
            />
          </Pressable>
        ) : null}
        {supports60Fps ? (
          <Pressable onPress={() => setIs60Fps(!is60Fps)} style={styles.button}>
            <Text style={styles.text}>
              {is60Fps ? '60' : '30'}
              {'\n'}FPS
            </Text>
          </Pressable>
        ) : null}
        {supportsHdr ? (
          <Pressable
            onPress={() => setEnableHdr(h => !h)}
            style={styles.button}>
            <MaterialIcon
              color="white"
              name={enableHdr ? 'hdr' : 'hdr-off'}
              size={24}
            />
          </Pressable>
        ) : null}
        {canToggleNightMode ? (
          <Pressable
            onPress={() => setEnableNightMode(!enableNightMode)}
            style={styles.button}>
            <IonIcon
              color="white"
              name={enableNightMode ? 'moon' : 'moon-outline'}
              size={24}
            />
          </Pressable>
        ) : null}
      </View>
    </GestureHandlerRootView>
  );
}
