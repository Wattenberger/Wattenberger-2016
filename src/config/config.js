const environment = process.env.NODE_ENV || "production"

const pathDel = process.env.CONTEXT == "windows" ? "\\" : "/"
const config = require(__dirname + pathDel + environment + ".js")
module.exports = config
