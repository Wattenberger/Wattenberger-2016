import React, {Component, PropTypes} from "react"
import classNames from "classnames"

require('./Sidebar.scss')

class Sidebar extends Component {
  static propTypes = {
    header: PropTypes.string
  };

  getClassName() {
    return classNames("Sidebar")
  }

  render() {
    let {header} = this.props
    return (
      <div className={this.getClassName()}>
        {!!header && <h2 className="Sidebar__header">{header}</h2>}
        {this.props.children}
      </div>
    )
  }
}

export default Sidebar
