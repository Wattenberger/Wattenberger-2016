import React, {Component} from "react"
import {connect} from "react-redux"
import classNames from "classnames"
import Footer from "components/Footer/Footer"
// import favicon images
require("file?name=img/resume.pdf!./resume.pdf")
require("file?name=favicon.ico!./favicon.ico")

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
        <img src={resume} />
        {resume}
        {this.props.children}
        <Footer />
      </div>
    )
  }
}

export default App
