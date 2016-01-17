var path = require("path")
var webpack = require("webpack")
var _ = require("lodash")
var config = require("../src/config/config")

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
      {test: /\.js(x)?$/, exclude: /node_modules/, loader: "babel",
      query: {
        plugins: ["transform-decorators-legacy"],
        presets: ["react", "es2015", "stage-0"],
      } },
      {test: /\.css$/,   loaders: ["style", "css", "autoprefixer"] },
      {test: /\.scss$/,  loaders: ["style", "css", "autoprefixer", "sass?include_paths[]=" + srcPath] },
      {
        test: /.*\.(gif|png|jpe?g|ico)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?{progressive: true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}',
        ]
      },
    ],
    // noParse: [/node_modules/]
    noParse: [/ignore/]
  },
  plugins: [
    new webpack.NoErrorsPlugin(),

    new webpack.DefinePlugin({
      "__DEV__" : JSON.stringify(process.env.NODE_ENV === "development"),
      "__PROD__": JSON.stringify(process.env.NODE_ENV === "production")
    }),

  ]
}
