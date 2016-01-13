import {createStore, applyMiddleware, combineReducers} from 'redux'
import {mapValues} from 'lodash'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'
import promiseMiddleware from 'redux-promise'

import {default as app} from "reducers/appReducer"

const loggerMiddleware = logger({
  transformer: state => mapValues(state, val => typeof val.toJS === "function"
    ? val.toJS()
    : val
  ),
  predicate: (getState, action) => __DEV__
})

const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware,
  thunkMiddleware,
  loggerMiddleware
)(createStore)

const rootReducer = combineReducers({
  app
})

// create a Redux instance using the dispatcher function
export default function(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState)
}
