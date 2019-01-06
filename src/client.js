import "@babel/register"
import "@babel/polyfill"
import React from "react"
import ReactDOM from "react-dom"
import { AppContainer } from 'react-hot-loader'
import {Provider} from "react-redux"
import Routes from "./routes"
import createStore from "./store"

const store = createStore()
const appRoot = document.getElementById('app')

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>,
    appRoot,
  )
}

render(Routes)

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept("./routes", () => {
    const nextRoutes = require("./routes").default
    render(nextRoutes);
  })
}
