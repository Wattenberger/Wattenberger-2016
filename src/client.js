import "babel-polyfill"
import React from "react"
import ReactDOM from "react-dom"
import {Provider} from "react-redux"
import Routes from "./routes"
import createStore from "./store"

if (__DEV__) window.Perf = require('react-addons-perf')

const store = createStore()
const appRoot = document.getElementById('app')
console.log(appRoot);

ReactDOM.render((
  <Provider store={store}>
    <Routes />
  </Provider>
), appRoot)
