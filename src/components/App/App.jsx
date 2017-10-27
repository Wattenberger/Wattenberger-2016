import React, {Component} from "react"
import {Route} from 'react-router-dom'
import {connect} from "react-redux"
import classNames from "classnames"
import Footer from "components/Footer/Footer"

import Home from "components/Home/Home"
import Sketches from "components/Sketches/Sketches"
import RochesterRealEstate from "components/Articles/RochesterRealEstate/RochesterRealEstate"
import Headlines from "components/Articles/Headlines/Headlines"

require('styles/app.scss')
require('./App.scss')

@connect(state => ({}))
class App extends Component {
  getClassName() {
    return classNames("App")
  }

  render() {
    return (
      <div className={this.getClassName()}>
        <Route path="/home" component={Home} />
        <Route path="/sketches" component={Sketches} />
        <Route path="/rochester-real-estate" component={RochesterRealEstate} />
        <Route path="/headlines" component={Headlines} />
        {this.props.children}
        <Footer />
      </div>
    )
  }
}

export default App
