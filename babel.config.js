module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
      [
        "module-resolver",
        {
          root: ["./src"],
          extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
          alias: {
            "@": "./src",
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@navigation": "./src/navigation",
            "@hooks": "./src/hooks",
            "@api": "./src/api",
            "@utils": "./src/utils",
            "@assets": "./assets",
            "@styles": "./src/styles",
            "@types": "./src/types",
            "@services": "./src/services",
            "@i18n": "./src/i18n",
            "@store": "./src/store",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
