import path from "path"
import webpack from "webpack"
import _ from "lodash"
import config from "../src/config/config"
import NyanProgressPlugin from 'nyan-progress-webpack-plugin'
import CleanWebpackPlugin from 'clean-webpack-plugin'

const srcPath    = path.resolve(__dirname, "../src")
const assetsPath = path.resolve(__dirname, "../../static")

export default {
  devtool: "cheap-module-eval-source-map",
  entry: {
    "main": [
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
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['node_modules', srcPath]
  },
  module: {
    loaders: [
      {test: /\js(x)?$/, exclude: /node_modules/, loaders: ["react-hot", "babel"] },
      {test: /\.css$/,   loaders: ["style", "css", "postcss"] },
      {test: /\.scss$/,  loaders: ["style", "css", "postcss", "sass?include_paths[]=" + srcPath] },
      {
        test: /.*\.(gif|png|jpe?g|pdf|svg)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?{progressive: true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
        ]
      }
    ],
    // noParse: [/node_modules/]
  },
  plugins: [
    // hot reload
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),

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

    new NyanProgressPlugin()
  ]
}
