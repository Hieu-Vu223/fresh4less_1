module.exports = function override(config, env) {
    // Ignore warnings about missing source maps for Firebase
    config.module.rules.push({
      test: /\.js$/,
      enforce: 'pre',
      use: [
        {
          loader: 'source-map-loader',
          // Remove any unsupported options
          options: {
            // Ensure this is a valid property
            filterSourceMappingUrl: (source) => {
              // Optionally, you can implement your filtering logic
              return true; // or false depending on your logic
            },
          },
        },
      ],
      include: /node_modules\/@firebase\/firestore/, // Adjust to your needs
    });
  
    return config;
  };
  