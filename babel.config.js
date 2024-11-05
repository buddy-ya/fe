// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
          alias: {
            "@": "./src",
            "@screens": "./src/screens",
            "@components": "./src/components",
            "@navigation": "./src/navigation",
            "@hooks": "./src/hooks",
            "@store": "./src/store",
            "@utils": "./src/utils",
            "@assets": "./assets",
          },
        },
      ],
    ],
  };
};
