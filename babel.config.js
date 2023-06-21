module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'react-native-reanimated/plugin',
      {
        // '__example_plugin_swift',
        globals: ['__example_plugin', '__scanCodes'],
      },
    ],
  ],
};
