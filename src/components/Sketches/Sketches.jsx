import React, {Component} from "react"
import classNames from "classnames"
import {list} from "./list"

require('./Sketches.scss')

class Sketches extends Component {
  getClassName() {
    return classNames("Sketches")
  }

  renderItem(item, idx) {
    let Sketch = item
    
    return <div className="Sketches__sketch" key={idx}>
      <h6>Sketch {idx + 1}</h6>
      <Sketch />
    </div>
  }

  render() {
    return (
      <div className={this.getClassName()}>
        <h2>Daily Sketches</h2>
        {list.map(::this.renderItem)}
      </div>
    )
  }
}

export default Sketches
