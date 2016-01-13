import React, {Component} from "react"
import classNames from "classnames"

require('./Footer.scss')

class Footer extends Component {
  getClassName() {
    return classNames("Footer")
  }

  render() {
    return (
      <div className={this.getClassName()}>
        <div className="Footer__contact">
          Shoot me an email at <a href="mailto:wattenberger@gmail.com">wattenberger@gmail.com</a>
        </div>
      </div>
    )
  }
}

export default Footer
