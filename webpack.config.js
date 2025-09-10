const path = require('path');

module.exports = (config) => {
  config.resolve = {
    ...config.resolve,
    fallback: {
      ...config.resolve.fallback,
      "util": require.resolve("util/"),
      "assert": require.resolve("assert/")
    }
  };
  
  return config;
};