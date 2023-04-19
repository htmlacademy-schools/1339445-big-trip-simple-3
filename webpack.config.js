import { resolve } from 'path';
import CopyPlugin from "copy-webpack-plugin";

export const entry = './src/main.js';
export const output = {
  filename: 'bundle.js',
  path: resolve(__dirname, 'build'),
  clean: true,
};
export const devtool = 'source-map';
export const plugins = [
  new CopyPlugin({
    patterns: [{ from: 'public' }],
  }),
];
export const module = {
  rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: ['babel-loader']
    },
    {
      test: /\.css$/i,
      use: ['style-loader', 'css-loader']
    }
  ]
};
