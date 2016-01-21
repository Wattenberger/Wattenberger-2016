import React, {Component} from "react"
import {Router, Route, Redirect, IndexRedirect} from "react-router"
import appHistory from "./appHistory"

import App from "components/App/App"
import Home from "components/Home/Home"
import Candidates from "components/Candidates/Candidates"
import HealthCare from "components/Articles/HealthCare/HealthCare"

class Routes extends Component {
  render() {
    return (
      <Router history={appHistory}>
        <Route path="/" component={App}>
          <IndexRedirect to="home" />
          <Route path="home" component={Home} />
          <Route path="healthcare" component={HealthCare} />
        </Route>
        <Redirect from="*" to="home" />
      </Router>
    )
  }
}

export default Routes
