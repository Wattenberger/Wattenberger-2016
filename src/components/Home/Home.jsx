import React, {Component} from "react"
import classNames from "classnames"
import HomeHeader from "./HomeHeader/HomeHeader"
import Portfolio from "components/Portfolio/Portfolio"

require('./Home.scss')

class Home extends Component {
  getClassName() {
    return classNames("Home")
  }

  render() {
    return (
      <div className={this.getClassName()}>
        <HomeHeader />
        <div className="Home__content">
          <Portfolio />p
        </div>
      </div>
    )
  }
}

export default Home
