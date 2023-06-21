import React from 'react';
import {useIsFocused} from '@react-navigation/native';
import type {PinchGestureHandlerGestureEvent} from 'react-native-gesture-handler';
import {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import {
  Camera,
  frameRateIncluded,
  sortFormats,
  useCameraDevices,
  type CameraDeviceFormat,
  type CameraRuntimeError,
  type Frame,
} from 'react-native-vision-camera';
import useAppState from './AppState';

declare let _WORKLET: true | undefined;

// export function examplePluginSwift(frame: Frame): string[] {
//   'worklet';
//   if (!_WORKLET) {
//     throw new Error(
//       'examplePluginSwift must be called from a frame processor!',
//     );
//   }

//   // @ts-expect-error because this function is dynamically injected by VisionCamera
//   return __example_plugin_swift(
//     frame,
//     'hello!',
//     'parameter2',
//     true,
//     42,
//     {test: 0, second: 'test'},
//     ['another test', 5],
//   );
// }

export function examplePlugin(frame: Frame): string[] {
  'worklet';
  if (!_WORKLET) {
    throw new Error('examplePlugin must be called from a frame processor!');
  }

  // @ts-expect-error because this function is dynamically injected by VisionCamera
  return __example_plugin(
    frame,
    'hello!',
    'parameter2',
    true,
    42,
    {test: 0, second: 'test'},
    ['another test', 5],
  );
}

export default function useCamera() {
  const appState = useAppState();
  const devices = useCameraDevices();
  const isFocussed = useIsFocused();

  const [cameraPosition, setCameraPosition] = React.useState<'front' | 'back'>(
    'back',
  );
  const [enableHdr, setEnableHdr] = React.useState(false);
  const [enableNightMode, setEnableNightMode] = React.useState(false);
  const [flash, setFlash] = React.useState<'off' | 'on'>('off');
  const [isCameraInitialized, setIsCameraInitialized] = React.useState(false);
  const [is60Fps, setIs60Fps] = React.useState(true);
  const [hasMicrophonePermission, setHasMicrophonePermission] =
    React.useState(false);

  const isPressingButton = useSharedValue(false);
  const zoom = useSharedValue(0);
  const device = devices[cameraPosition];
  const isActive = appState === 'active' && isFocussed;
  const maxZoom = Math.min(device?.maxZoom ?? 1, 20);
  const minZoom = device?.minZoom ?? 1;
  const neutralZoom = 1 ?? 1;

  const animatedProps = useAnimatedProps(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
    return {zoom: z};
  }, [maxZoom, minZoom, zoom]);

  const onPinchGesture = useAnimatedGestureHandler<
    PinchGestureHandlerGestureEvent,
    {startZoom?: number}
  >({
    onStart: (_, context) => {
      context.startZoom = zoom.value;
    },
    onActive: (event, context) => {
      const startZoom = context.startZoom ?? 0;
      const scale = interpolate(
        event.scale,
        [1 - 1 / 3, 1, 3],
        [-1, 0, 1],
        Extrapolate.CLAMP,
      );
      zoom.value = interpolate(
        scale,
        [-1, 0, 1],
        [minZoom, startZoom, maxZoom],
        Extrapolate.CLAMP,
      );
    },
  });

  const onFlashPressed = React.useCallback(() => {
    setFlash(f => (f === 'off' ? 'on' : 'off'));
  }, []);

  const onFlipCameraPressed = React.useCallback(() => {
    setCameraPosition(p => (p === 'back' ? 'front' : 'back'));
  }, []);

  const onDoubleTap = React.useCallback(() => {
    onFlipCameraPressed();
  }, [onFlipCameraPressed]);

  const onError = React.useCallback((error: CameraRuntimeError) => {
    console.error(error);
  }, []);

  const onInitialized = React.useCallback(() => {
    setIsCameraInitialized(true);
  }, []);

  const setIsPressingButton = React.useCallback(
    (_isPressingButton: boolean) => {
      isPressingButton.value = _isPressingButton;
    },
    [isPressingButton],
  );

  const formats = React.useMemo<Array<CameraDeviceFormat>>(() => {
    if (device?.formats == null) {
      return [];
    }
    return device.formats.sort(sortFormats);
  }, [device?.formats]);

  const fps = React.useMemo(() => {
    if (!is60Fps) {
      return 30;
    }

    if (enableNightMode && !device?.supportsLowLightBoost) {
      // User has enabled Night Mode, but Night Mode is not natively supported, so we simulate it by lowering the frame rate.
      return 30;
    }

    const supportsHdrAt60FPS = formats.some(
      f =>
        f.supportsVideoHDR &&
        f.frameRateRanges.some(r => frameRateIncluded(r, 60)),
    );

    if (enableHdr && !supportsHdrAt60FPS) {
      // User has enabled HDR, but HDR is not supported at 60 FPS.
      return 30;
    }

    const supports60Fps = formats.some(f =>
      f.frameRateRanges.some(r => frameRateIncluded(r, 60)),
    );
    if (!supports60Fps) {
      // 60 FPS is not supported by any format.
      return 30;
    }
    // If nothing blocks us from using it, we default to 60 FPS.
    return 60;
  }, [
    device?.supportsLowLightBoost,
    enableHdr,
    enableNightMode,
    formats,
    is60Fps,
  ]);

  const format = React.useMemo(() => {
    let result = formats;
    if (enableHdr) {
      // We only filter by HDR capable formats if HDR is set to true.
      // Otherwise we ignore the `supportsVideoHDR` property and accept formats which support HDR `true` or `false`
      result = result.filter(f => f.supportsVideoHDR || f.supportsPhotoHDR);
    }

    // find the first format that includes the given FPS
    return result.find(f =>
      f.frameRateRanges.some(r => frameRateIncluded(r, fps)),
    );
  }, [formats, fps, enableHdr]);

  const supports60Fps = React.useMemo(
    () =>
      formats.some(f =>
        f.frameRateRanges.some(rate => frameRateIncluded(rate, 60)),
      ),
    [formats],
  );

  const supportsCameraFlipping = React.useMemo(
    () => devices.back != null && devices.front != null,
    [devices.back, devices.front],
  );

  const supportsHdr = React.useMemo(
    () => formats.some(f => f.supportsVideoHDR || f.supportsPhotoHDR),
    [formats],
  );

  React.useEffect(() => {
    Camera.getMicrophonePermissionStatus().then(status =>
      setHasMicrophonePermission(status === 'authorized'),
    );
  }, []);

  React.useEffect(() => {
    // Run everytime the neutralZoomScaled value changes. (reset zoom when device changes)
    zoom.value = neutralZoom;
  }, [neutralZoom, zoom]);

  const canToggleNightMode = enableNightMode
    ? true // it's enabled so you have to be able to turn it off again
    : (device?.supportsLowLightBoost ?? false) || fps > 30; // either we have native support, or we can lower the FPS
  const supportsFlash = device?.hasFlash ?? false;

  if (device != null && format != null) {
    console.log(
      `Re-rendering camera page with ${
        isActive ? 'active' : 'inactive'
      } camera. ` +
        `Device: "${device.name}" (${format.photoWidth}x${format.photoHeight} @ ${fps}fps)`,
    );
  } else {
    console.log('re-rendering camera page without active camera');
  }

  return {
    audio: hasMicrophonePermission,
    animatedProps,
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
    setEnableHdr,
    setEnableNightMode,
    setIs60Fps,
    setIsPressingButton,
    supports60Fps,
    supportsCameraFlipping,
    supportsFlash,
    supportsHdr,
    zoom,
  };
}
