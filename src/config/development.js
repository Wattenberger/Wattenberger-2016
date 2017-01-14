exports.WEBPACK_HOST = process.env.HOST               || "0.0.0.0"
exports.WEBPACK_PORT = parseInt(process.env.PORT) + 1 || 3001
exports.STATIC_HOST  = process.env.STATIC_HOST        || exports.WEBPACK_HOST + ":" + exports.WEBPACK_PORT
