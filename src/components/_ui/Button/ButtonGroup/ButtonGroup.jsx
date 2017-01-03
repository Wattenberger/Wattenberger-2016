import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import Button from "./../Button"

require('./ButtonGroup.scss')

class ButtonGroup extends Component {
  static propTypes = {
    buttons: PropTypes.array,
    onChange: PropTypes.func
  }

  getClassName() {
    return classNames(
      "ButtonGroup", this.props.className
    )
  }

  getButtonClassName(button) {
    return classNames({
      "Button--active": button.active
    })
  }

  render() {
    let {buttons, onChange} = this.props

    return (
      <div className={this.getClassName()}>
        {buttons.map((button, idx) =>
          <Button type="button"
                  key={idx}
                  className={this.getButtonClassName(button)}
                  onClick={onChange.bind(this, button)}>
            {button.label}
          </Button>
        )}
      </div>
      )
  }
}

export default ButtonGroup
