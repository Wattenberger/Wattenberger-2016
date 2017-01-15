// Express middleware to render the app server-side and expose its state to the client
function renderStaticHTML(req, res, next) {
  try {
    res.sendFile(`${__dirname}/index.html`)
  } catch (e) {
    next(e)
  }
}

// export default render
export default renderStaticHTML
