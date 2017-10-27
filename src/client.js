import "babel-core/register"
import "babel-polyfill"
import React from "react"
import ReactDOM from "react-dom"
import {Provider} from "react-redux"
import Routes from "./routes"
import createStore from "./store"

const store = createStore()
const appRoot = document.getElementById('app')

ReactDOM.render((
  <Provider store={store}>
    <Routes />
  </Provider>
), appRoot)
