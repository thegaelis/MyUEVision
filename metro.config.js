const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');


const config = () => {
    const { assetExts } = getDefaultConfig.resolver;
    return {
        resolver: {
            assetExts: [...assetExts, 'bin'],
        }
    }
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
