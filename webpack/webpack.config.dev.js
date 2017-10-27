import path from "path"
import webpack from "webpack"
import _ from "lodash"
import config from "../src/config/config"
import CleanWebpackPlugin from 'clean-webpack-plugin'
import WebpackMonitor from 'webpack-monitor';

const srcPath    = path.resolve(__dirname, "../src")
const assetsPath = path.resolve(__dirname, "../../static")

export default {
  devtool: 'source-map',
  entry: {
    "main": [
      "react-hot-loader/patch",
      "babel-polyfill",
      `webpack-dev-server/client?http://${config.WEBPACK_HOST}:${config.WEBPACK_PORT}`,
      "webpack/hot/only-dev-server",
      "./src/client.js"
    ],
  },
  target: "web",
  output: {
    path: assetsPath,
    publicPath: `//${config.STATIC_HOST}/static/`,
    filename: "app.min.js",
    chunkFilename: "[chunkhash].js"
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules', srcPath]
  },
  module: {
    rules: [
      {test: /\js(x)?$/, exclude: /node_modules/, loader: "babel-loader", query: {presets: ["react"]} },
      {test: /\.css$/,   use: ["style-loader", "css-loader", "postcss-loader"] },
      {test: /\.scss$/,  use: ["style-loader", "css-loader", "postcss-loader", "sass-loader?include_paths[]=" + srcPath] },
      {
        test: /.*\.(gif|png|jpe?g|pdf|svg|csv)$/i,
        use: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack-loader'
        ]
      }
    ],
    // noParse: [/node_modules/]
  },
  plugins: [
    // hot reload
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),

    new webpack.DefinePlugin({
      "__DEV__" : JSON.stringify(process.env.NODE_ENV === "development"),
      "__PROD__": JSON.stringify(process.env.NODE_ENV === "production")
    }),

    new CleanWebpackPlugin(['dist'], {
      root: __dirname,
      verbose: true,
      dry: false,
      exclude: ['favicon.*']
    }),

    // new WebpackMonitor({
    //   capture: true, // -> default 'true'
    //   target: '../monitor/myStatsStore.json', // default -> '../monitor/stats.json'
    //   launch: true, // -> default 'false'
    //   port: 3030, // default -> 8081
    // }),
  ]
}
