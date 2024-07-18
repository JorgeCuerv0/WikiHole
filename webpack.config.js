const path = require('path');

module.exports = {
  mode: 'development', // or 'production'
  entry: './src/frontend/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Apply Babel loader to JavaScript files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/i, // Apply CSS loaders
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i, // Apply file loader to image files
        type: 'asset/resource',
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 3000,
  },
  performance: {
    maxAssetSize: 500000, // Increase asset size limit
    maxEntrypointSize: 500000, // Increase entry point size limit
  },
};
