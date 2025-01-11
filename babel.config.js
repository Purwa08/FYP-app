module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [],
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