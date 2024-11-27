const Dotenv = require('dotenv-webpack');

module.exports = function override(config, env) {
  config.plugins = [
    ...config.plugins,
    new Dotenv({
      path: '.env', // Path to your .env file (parent directory)
      systemvars: true, // Load system environment variables as well
    }),
  ];

  return config;
};
