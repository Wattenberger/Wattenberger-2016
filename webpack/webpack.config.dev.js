import path from "path"
import webpack from "webpack"
import _ from "lodash"
import config from "../src/config/config"
import CleanWebpackPlugin from 'clean-webpack-plugin'
import WebpackMonitor from 'webpack-monitor';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';

const srcPath    = path.resolve(__dirname, "../src")
const assetsPath = path.resolve(__dirname, "../../static")

export default {
  mode: "development",
  devtool: "eval",
  entry: {
    "main": [
      "react-hot-loader/patch",
      "@babel/polyfill",
      `webpack-dev-server/client?http://${config.WEBPACK_HOST}:${config.WEBPACK_PORT}`,
      "webpack/hot/only-dev-server",
      "./src/client.js"
    ],
  },
  output: {
    path: assetsPath,
    publicPath: `//${config.STATIC_HOST}/static/`,
    filename: "app.min.js",
    pathinfo: false,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules', srcPath],
    symlinks: false,
  },
  module: {
    rules: [
      {test: /\js(x)?$/, exclude: /node_modules/, loader: "babel-loader?cacheDirectory", query: {presets: ["@babel/react"]} },
      // {test: /\json?$/,  exclude: /node_modules/, loader: "file-loader" },
      {test: /\.css$/,   use: ["style-loader", "css-loader", "postcss-loader"] },
      {test: /\.scss$/,  use: ["style-loader", "css-loader", "postcss-loader", "sass-loader?include_paths[]=" + srcPath] },
      {
        test: /.*\.(gif|png|jpe?g|pdf|svg|csv)$/i,
          // include: [
          //     staticPath
          // ],
          use: [
              'file-loader',
              {
                  loader: 'image-webpack-loader',
                  options: {
                      disable: true, // webpack@2.x and newer
                  },
              },
          ],
      },
    ],
    // noParse: [/node_modules/]
  },
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  plugins: [
    // hot reload
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),
    // new HardSourceWebpackPlugin(),

    new webpack.DefinePlugin({
      "__DEV__" : JSON.stringify(process.env.NODE_ENV === "development"),
      "__PROD__": JSON.stringify(process.env.NODE_ENV === "production")
    }),

    // new WebpackMonitor({
    //   capture: true, // -> default 'true'
    //   target: '../monitor/myStatsStore.json', // default -> '../monitor/stats.json'
    //   launch: true, // -> default 'false'
    //   port: 3030, // default -> 8081
    // }),
  ]
}
