import path from "path"
import express from "express"
import compression from "compression"
import bodyParser from "body-parser"
import morgan from "morgan"
import config from "../config/config"
import render from "./render"

// Init express  server
const app = express()

// Express schtuff
app.use(morgan(app.get("env") === "production" ? "combined" : "dev"))
app.use(bodyParser.json())
app.use(compression())

app.use('/static/', express.static('dist'))

// Dev: serve static files from webpack dev server
if (app.get("env") === "development") require ("../../webpack/dev-server")

// Render app server-side and send it as response
app.use(render)

// Generic server errors (eg. not caught by components)
app.use((err, req, res, next) => {
  console.log("Error on request %s %s", req.method, req.url)
  console.log(err)
  console.log(err.stack)
  res.status(500).send("Uh oh, something happened.")
})

// Start Express server
app.set("port", process.env.PORT || 3000)

app.listen(app.get("port"), () => {
  console.log(`Express ${app.get("env")} server listening on ${app.get("port")}. Get ’er done!`)
})
