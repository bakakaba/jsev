"use strict";

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: []
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  plugins: [new ForkTsCheckerWebpackPlugin()]
};
