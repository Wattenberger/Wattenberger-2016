import React, {Component} from "react"
import classNames from "classnames"
import WatercolorCanvas from "components/_shared/WatercolorCanvas/WatercolorCanvas"

require('./HomeHeader.scss')

class HomeHeader extends Component {
  getClassName() {
    return classNames("HomeHeader")
  }

  render() {
    return (
      <div className={this.getClassName()}>
        <WatercolorCanvas />
        <div className="HomeHeader__content">
          <div className="HomeHeader__content__text">
            <div className="HomeHeader__content__text__top">Hi I’m</div>
            <h1>Amelia Wattenberger</h1>
            <div className="HomeHeader__content__text__description">
              I write code, think about data, and create digital experiences. Currently front-end development & data visualization at <a href="http://umbel.com">Umbel</a> in Austin, TX—the land of breakfast tacos and craft beer.
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default HomeHeader
