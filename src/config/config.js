const environment = process.env.NODE_ENV || "production"

const config = require("./" + environment + ".js")
module.exports = config
