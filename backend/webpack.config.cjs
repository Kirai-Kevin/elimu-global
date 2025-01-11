const path = require('path');

module.exports = {
  target: 'node',
  mode: process.env.NODE_ENV || 'development',
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.mjs'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.mjs$/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  externals: [
    // Handle ES modules that can't be directly required
    function ({ request }, callback) {
      if (/^pdfjs-dist(\/.*)?$/.test(request)) {
        return callback(null, `commonjs ${request}`);
      }
      callback();
    }
  ],
  optimization: {
    minimize: false
  }
};
