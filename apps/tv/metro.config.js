const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project and workspace directories
const projectRoot = __dirname;
// This can be replaced with `find-up` or similar if needed
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];


// 4. Ensure we alias React and React Native to the same instance
config.resolver.extraNodeModules = {
  'react': path.resolve(workspaceRoot, 'node_modules/react'),
  'react-native': path.resolve(workspaceRoot, 'node_modules/react-native'),
  'expo-router': path.resolve(workspaceRoot, 'node_modules/expo-router'),
  '@react-navigation/native': path.resolve(workspaceRoot, 'node_modules/@react-navigation/native'),
  '@react-navigation/core': path.resolve(workspaceRoot, 'node_modules/@react-navigation/core'),
  '@react-navigation/elements': path.resolve(workspaceRoot, 'node_modules/@react-navigation/elements'),
  'whatwg-fetch': path.resolve(workspaceRoot, 'node_modules/whatwg-fetch'),
};

module.exports = config;
