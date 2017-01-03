import React, {Component} from "react"
import classNames from "classnames"
import Keypress, {KEYS} from 'components/_ui/Keypress/Keypress'
import Button from 'components/_ui/Button/Button'
import {list} from "./list"

require('./Sketches.scss')

class Sketches extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: list.length - 1
    }
  }

  keypresses = {
    [KEYS.LEFT]: this.changeSketch.bind(this, -1),
    [KEYS.RIGHT]: this.changeSketch.bind(this, 1),
  }

  getClassName() {
    return classNames("Sketches")
  }

  changeSketch(change) {
    let {active} = this.state
    let newIdx = active + change % list.length
    if (newIdx < 0) newIdx = list.length + newIdx
    if (newIdx >= list.length) newIdx = list.length - newIdx
    if (_.inRange(newIdx, 0, list.length)) {
      this.setState({active: newIdx})
    }
  }

  renderItem(item) {
    let {active} = this.state
    let Sketch = list[active]

    return <div className="Sketches__sketch">
      <Sketch />
    </div>
  }

  render() {
    let {active} = this.state
    
    return (
      <div className={this.getClassName()}>
        <Keypress keys={this.keypresses} />
        <div className="Sketches__header">
          <h2>Daily Sketches</h2>
          <div className="Sketches__header__buttons">
            <Button onClick={this.changeSketch.bind(this, -1)}>↢</Button>
            <h6>Sketch {active + 1}</h6>
            <Button onClick={this.changeSketch.bind(this, 1)}>↣</Button>
          </div>
        </div>
        {this.renderItem()}
      </div>
    )
  }
}

export default Sketches
