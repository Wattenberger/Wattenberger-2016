import WebpackDevServer from "webpack-dev-server"
import webpack from "webpack"
import config from "./webpack.config.dev"
import path from "path"

const WEBPACK_HOST = process.env.HOST                  || "0.0.0.0"
const WEBPACK_PORT = parseInt(process.env.PORT) + 1    || 3001
const SERVER_PORT  = parseInt(process.env.SERVER_PORT) || 3000

const serverOptions = {
  contentBase: `http://${WEBPACK_HOST}:${WEBPACK_PORT}`,
  quiet: false,
  noInfo: false,
  hot: true,
  inline: true,
  publicPath: config.output.publicPath,
  proxy: {
    '*': `http://${WEBPACK_HOST}:${SERVER_PORT}`
  }
}


const compiler = webpack(config)
const webpackDevServer = new WebpackDevServer(compiler, serverOptions)

webpackDevServer.listen(WEBPACK_PORT, WEBPACK_HOST, () => {
  console.log(`Webpack development server listening on ${WEBPACK_HOST}:${WEBPACK_PORT}`)
})
