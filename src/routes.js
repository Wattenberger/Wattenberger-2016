import React, {Component} from "react"
import {Router, Route, Redirect, IndexRedirect} from "react-router"
import appHistory from "./appHistory"

import App from "components/App/App"
import Home from "components/Home/Home"
import Sketches from "components/Sketches/Sketches"
import RochesterRealEstate from "components/Articles/RochesterRealEstate/RochesterRealEstate"

class Routes extends Component {
  render() {
    return (
      <Router history={appHistory}>
        <Route path="/" component={App}>
          <IndexRedirect to="home" />
          <Route path="home" component={Home} />
          <Route path="sketches" component={Sketches} />
          <Route path="rochester-real-estate" component={RochesterRealEstate} />
        </Route>
        <Redirect from="*" to="home" />
      </Router>
    )
  }
}

export default Routes
