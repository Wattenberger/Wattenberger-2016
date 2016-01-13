const environment = process.env.NODE_ENV || (
  __DEV__  ? "development" :
  __PROD__ ? "production" :
             "development"
)

const config = require(`./${environment}.js`)
module.exports = config
