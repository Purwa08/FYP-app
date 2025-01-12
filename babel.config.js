module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          safe: false,
          allowUndefined: true,
        },
    ],
  ],
  };
};


// module.exports = {
//   presets: ["babel-preset-expo"],
//   plugins: ["nativewind/babel"],
// };


// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: ["babel-preset-expo"],
//     plugins: ["nativewind/babel",   // For NativeWind styling
//       "expo-router/babel"],
//   };
// };