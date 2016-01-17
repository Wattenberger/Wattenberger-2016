import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import d3 from "d3"

require('./Axis.scss')
const orientations = {
  x: "bottom",
  y: "left"
}

class Axis extends Component {
  static propTypes = {
    axis: PropTypes.oneOf(["x","y"]),
    formatting: PropTypes.func,
    scale: PropTypes.func,
    range: PropTypes.array,
    domain: PropTypes.array,
    tickNumber: PropTypes.number,
    transitionDuration: PropTypes.number
  };

  static defaultProps = {
    range: [],
    domain: []
  };

  getOrientation() {
    return orientations[this.props.axis]
  }

  update(props) {
    let {formatting, scale, range, domain, tickNumber} = props

    let axis = d3.svg.axis()
      .scale(scale)
      .ticks(6)
      .orient(this.getOrientation())

    if (formatting) axis.tickFormat(formatting)

    d3.select(this.refs.el)
      .transition()
        .duration(this.props.transitionDuration)
        .call(axis)
  }

  componentDidMount() {
    this.update(this.props)
  }

  componentWillReceiveProps(newProps) {
    this.update(newProps)
  }

  renderLabel() {
    return <text className={"Axis--" + this.props.axis + "__label"}>
      {this.props.xAxisLabel}
    </text>
  }

  getClassName() {
    return classNames(
      "Axis",
      "Axis--" + this.props.axis,
      this.props.className
    )
  }

  render() {
    return (
      <g ref="el" className={this.getClassName()}>
        {!!this.props.xAxisLabel && this.renderLabel()}
      </g>
    )
  }
}

export default Axis
