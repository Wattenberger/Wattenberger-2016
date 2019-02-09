var path = require("path")
var webpack = require("webpack")
var _ = require("lodash")
var config = require("../src/config/config")
var CleanWebpackPlugin = require('clean-webpack-plugin')

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin')

const srcPath    = path.resolve(__dirname, "../src")
const assetsPath = path.resolve(__dirname, "../dist")

module.exports = {
  mode: "production",
  entry: {
    "main": [
      "@babel/polyfill",
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
    symlinks: false,
  },
  module: {
    rules: [
      {test: /\js(x)?$/, loader: "babel-loader", query: {presets: ["@babel/react"]} },
      {test: /\.css$/,   use: ["style-loader", "css-loader", "postcss-loader"], sideEffects: true, },
      {test: /\.scss$/,  use: ["style-loader", "css-loader", "postcss-loader", "sass-loader?include_paths[]=" + srcPath], sideEffects: true, },
      {
        test: /.*\.(gif|png|jpe?g|pdf|svg|csv)$/i,
        sideEffects: true,
        use: [
            'file-loader',
            {
                loader: 'image-webpack-loader',
                options: {
                    disable: true, // webpack@2.x and newer
                },
            },
        ],
      }
  ],
  // noParse: [/node_modules/]
  // noParse: [/ignore/]
  },
  optimization: {
      minimizer: [
          new UglifyJsPlugin({
            cache: true,
          //   parallel: true,
            sourceMap: true,
          }),
          new OptimizeCSSAssetsPlugin({}),
      ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),

    new TerserPlugin({
      parallel: true,
      terserOptions: {
        ecma: 6,
      },
    }),
    
    new webpack.DefinePlugin({
      "__DEV__" : JSON.stringify(process.env.NODE_ENV === "development"),
      "__PROD__": JSON.stringify(process.env.NODE_ENV === "production")
    }),
  ]
}
