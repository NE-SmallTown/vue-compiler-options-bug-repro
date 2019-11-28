
const config = {
  presets: [
    ['@babel/env'],
  ],

  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-export-default-from'],
    ['@babel/plugin-proposal-export-namespace-from'],
    ['@babel/plugin-proposal-object-rest-spread'],
    ['@babel/plugin-proposal-class-properties'],
  ],
};

module.exports = config;
