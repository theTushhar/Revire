const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.blockList = [
  ...Array.from(config.resolver.blockList || []),
  /.*\/android\/\.gradle-local\/.*/,
  /.*\/android\/\.gradle\/.*/,
  /.*\/android\/build\/.*/,
];

module.exports = config;
