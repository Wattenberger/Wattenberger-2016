import "babel-core/register"
import "babel-polyfill"
import React from "react"
import ReactDOM from "react-dom"
import {Provider} from "react-redux"
import Routes from "./routes"
import createStore from "./store"

if (__DEV__) window.Perf = require('react-addons-perf')

import SVGDOMPropertyConfig from 'react/lib/SVGDOMPropertyConfig';
import DOMProperty from 'react/lib/DOMProperty';

["stdDeviation", "result", "mode", "values", "in", "in2"].forEach(prop => {
  SVGDOMPropertyConfig.Properties[prop] = DOMProperty.injection.MUST_USE_ATTRIBUTE;
  SVGDOMPropertyConfig.DOMAttributeNames[prop] = prop;
})
console.log(SVGDOMPropertyConfig.Properties)

const store = createStore()
const appRoot = document.getElementById('app')

ReactDOM.render((
  <Provider store={store}>
    <Routes />
  </Provider>
), appRoot)
