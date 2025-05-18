// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  // SVG 로더 지정
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

config.resolver = {
  ...resolver,
  // SVG 확장자를 assetExts 에서 빼고 sourceExts 에 추가
  assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...resolver.sourceExts, 'svg'],
};

// 마지막에 withNativeWind 으로 감싸줍니다.
// input 옵션은 글로벌 Tailwind CSS 파일 경로입니다.
module.exports = withNativeWind(config, {
  input: './global.css',
});
