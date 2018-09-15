var path = require("path")
var webpack = require("webpack")
var _ = require("lodash")
var config = require("../src/config/config")
var CleanWebpackPlugin = require('clean-webpack-plugin')

const srcPath    = path.resolve(__dirname, "../src")
const assetsPath = path.resolve(__dirname, "../dist")

module.exports = {
  entry: {
    "main": [
      "./src/client.js"
    ],
  },
  target: "web",
  output: {
    path: assetsPath,
    publicPath: "//" + config.STATIC_HOST + "/static/",
    filename: "app.min.js",
    chunkFilename: "[chunkhash].js"
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules', srcPath],
    symlinks: false
  },
  module: {
    rules: [
      {test: /\js(x)?$/, exclude: /node_modules/, loader: "babel-loader", query: {presets: ["react"]} },
      {test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
        ]
      },
      {test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
          "sass-loader?include_paths[]=" + srcPath,
        ]
      },
      {
        test: /.*\.(gif|png|jpe?g|pdf|svg|csv)$/i,
        use: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack-loader'
        ]
      },
  ],
  // noParse: [/node_modules/]
  noParse: [/ignore/]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),

    new webpack.DefinePlugin({
      "__DEV__" : JSON.stringify(process.env.NODE_ENV === "development"),
      "__PROD__": JSON.stringify(process.env.NODE_ENV === "production")
    }),
  ]
}
