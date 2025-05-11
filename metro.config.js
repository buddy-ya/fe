const { getDefaultConfig } = require('@expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = withNativeWind({
  ...defaultConfig,
  transformer: {
    ...defaultConfig.transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    ...defaultConfig.resolver,
    assetExts: defaultConfig.resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
  },
});
