import React from 'react';
import {Dimensions, Platform, StyleSheet, View} from 'react-native';
import {
  State,
  PanGestureHandler,
  TapGestureHandler,
  type PanGestureHandlerGestureEvent,
  type TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import Reanimated, {
  cancelAnimation,
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {
  Camera,
  PhotoFile,
  TakePhotoOptions,
  TakeSnapshotOptions,
  VideoFile,
} from 'react-native-vision-camera';

const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
    borderColor: 'white',
  },
  flex: {
    flex: 1,
  },
  shadow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e34077',
  },
});

const CaptureButton: React.FC<{
  camera: React.RefObject<Camera>;
  cameraZoom: Reanimated.SharedValue<number>;
  enabled: boolean;
  flash: 'off' | 'on';
  minZoom: number;
  maxZoom: number;
  onMediaCaptured: (
    media: PhotoFile | VideoFile,
    type: 'photo' | 'video',
  ) => void;
  setIsPressingButton: (isPressingButton: boolean) => void;
}> = ({
  camera,
  cameraZoom,
  enabled,
  flash,
  maxZoom,
  minZoom,
  onMediaCaptured,
  setIsPressingButton,
  ...props
}): React.ReactElement => {
  const safeAreaInsets = useSafeAreaInsets();
  const isPressingButton = useSharedValue(false);
  const recordingProgress = useSharedValue(0);

  const screenHeight = Platform.select<number>({
    android: Dimensions.get('screen').height - safeAreaInsets.bottom,
    ios: Dimensions.get('window').height,
  }) as number;

  const onPanGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {offsetY?: number; startY?: number}
  >({
    onStart: (event, context) => {
      context.startY = event.absoluteY;
      context.offsetY = interpolate(
        cameraZoom.value,
        [minZoom, maxZoom],
        [0, context.startY - context.startY * 0.7],
        Extrapolate.CLAMP,
      );
    },
    onActive: (event, context) => {
      const offset = context.offsetY ?? 0;
      cameraZoom.value = interpolate(
        event.absoluteY - offset,
        [context.startY ?? screenHeight * 0.7, context.startY ?? screenHeight],
        [maxZoom, minZoom],
        Extrapolate.CLAMP,
      );
    },
  });

  const buttonStyle = useAnimatedStyle(() => {
    let scale: number;
    if (enabled) {
      if (isPressingButton.value) {
        scale = withRepeat(
          withSpring(1, {
            damping: 1000,
            stiffness: 100,
          }),
          -1,
          true,
        );
      } else {
        scale = withSpring(0.9, {
          damping: 300,
          stiffness: 500,
        });
      }
    } else {
      scale = withSpring(0.6, {
        damping: 300,
        stiffness: 500,
      });
    }
    return {
      alignSelf: 'center',
      opacity: withTiming(enabled ? 1 : 0.3, {
        duration: 100,
        easing: Easing.linear,
      }),
      position: 'absolute',
      transform: [{scale}] as Array<never>,
    };
  }, [enabled, isPressingButton]);

  const shadowStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          scale: withSpring(isPressingButton.value ? 1 : 0, {
            mass: 1,
            damping: 35,
            stiffness: 300,
          }),
        },
      ] as Array<never>,
    }),
    [isPressingButton],
  );

  const takePhotoOptions = React.useMemo<
    TakePhotoOptions & TakeSnapshotOptions
  >(
    () => ({
      photoCodec: 'jpeg',
      qualityPrioritization: 'speed',
      flash: flash,
      quality: 90,
      skipMetadata: true,
    }),
    [flash],
  );

  const onStoppedRecording = React.useCallback(() => {
    isRecording.current = false;
    cancelAnimation(recordingProgress);
    console.log('stopped recording video!');
  }, [recordingProgress]);

  const stopRecording = React.useCallback(async () => {
    try {
      if (camera.current == null) {
        throw new Error('Camera ref is null!');
      }

      console.log('calling stopRecording()...');
      await camera.current.stopRecording();
      console.log('called stopRecording()!');
    } catch (e) {
      console.error('failed to stop recording!', e);
    }
  }, [camera]);

  const startRecording = React.useCallback(() => {
    try {
      if (camera.current == null) {
        throw new Error('Camera ref is null!');
      }

      console.log('calling startRecording()...');
      camera.current.startRecording({
        flash: flash,
        onRecordingError: error => {
          console.error('Recording failed!', error);
          onStoppedRecording();
        },
        onRecordingFinished: video => {
          console.log(`Recording successfully finished! ${video.path}`);
          onMediaCaptured(video, 'video');
          onStoppedRecording();
        },
      });
      // TODO: wait until startRecording returns to actually find out if the recording has successfully started
      console.log('called startRecording()!');
      isRecording.current = true;
    } catch (e) {
      console.error('failed to start recording!', e, 'camera');
    }
  }, [camera, flash, onMediaCaptured, onStoppedRecording]);

  const takePhoto = React.useCallback(async () => {
    try {
      if (camera.current == null) {
        throw new Error('Camera ref is null!');
      }
      const photo = await camera.current.takePhoto(takePhotoOptions);
      onMediaCaptured(photo, 'photo');
    } catch (e) {
      console.error('Failed to take photo!', e);
    }
  }, [camera, onMediaCaptured, takePhotoOptions]);

  const onHandlerStateChanged = React.useCallback(
    async ({nativeEvent: event}: TapGestureHandlerStateChangeEvent) => {
      console.debug(`state: ${Object.keys(State)[event.state]}`);
      switch (event.state) {
        case State.BEGAN:
          const now = new Date();
          isPressingButton.value = true;
          pressDownDate.current = now;
          recordingProgress.value = 0;
          setTimeout(() => {
            if (now === pressDownDate.current) {
              startRecording();
            }
          }, 200);
          setIsPressingButton(true);
          return;
        case State.END:
        case State.FAILED:
        case State.CANCELLED:
          try {
            if (pressDownDate.current == null) {
              throw new Error('PressDownDate ref .current was null!');
            }
            const diff = new Date().getTime() - pressDownDate.current.getTime();
            pressDownDate.current = undefined;
            if (diff < 200) {
              await takePhoto();
            } else {
              await stopRecording();
            }
          } finally {
            setTimeout(() => {
              isPressingButton.value = false;
              setIsPressingButton(false);
            }, 500);
          }
          return;
        default:
          break;
      }
    },
    [
      isPressingButton,
      recordingProgress,
      setIsPressingButton,
      startRecording,
      stopRecording,
      takePhoto,
    ],
  );

  const isRecording = React.useRef(false);
  const panHandler = React.useRef<PanGestureHandler>();
  const pressDownDate = React.useRef<Date>();
  const tapHandler = React.useRef<TapGestureHandler>();

  return (
    <TapGestureHandler
      enabled={enabled}
      maxDurationMs={99999999}
      onHandlerStateChange={onHandlerStateChanged}
      ref={tapHandler}
      shouldCancelWhenOutside={false}
      simultaneousHandlers={panHandler}>
      <Reanimated.View
        style={[buttonStyle, {bottom: safeAreaInsets.bottom}]}
        {...props}>
        <PanGestureHandler
          enabled={enabled}
          ref={panHandler}
          failOffsetX={[
            -Dimensions.get('window').width,
            Dimensions.get('window').width,
          ]}
          activeOffsetY={[-2, 2]}
          onGestureEvent={onPanGestureEvent}
          simultaneousHandlers={tapHandler}>
          <Reanimated.View style={styles.flex}>
            <Reanimated.View style={[styles.shadow, shadowStyle]} />
            <View style={styles.button} />
          </Reanimated.View>
        </PanGestureHandler>
      </Reanimated.View>
    </TapGestureHandler>
  );
};

export default React.memo(CaptureButton);
