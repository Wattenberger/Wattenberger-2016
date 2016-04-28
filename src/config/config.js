const environment = process.env.NODE_ENV || "development"

const config = require("./" + environment + ".js")
module.exports = config
