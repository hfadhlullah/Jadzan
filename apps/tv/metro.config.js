const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve packages
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Force common libraries to use the version in the project root to avoid duplication
config.resolver.extraNodeModules = {
  'react': path.resolve(projectRoot, 'node_modules/react'),
  'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
  '@react-navigation/native': path.resolve(projectRoot, 'node_modules/@react-navigation/native'),
};

// 4. Ensure we don't pick up common libraries from other locations
config.resolver.disableHierarchicalLookup = true;

// 5. For web, ensure we handle .mjs and other extensions correctly
config.resolver.sourceExts.push('mjs');

module.exports = config;
