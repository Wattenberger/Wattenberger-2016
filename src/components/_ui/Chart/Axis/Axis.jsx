import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import * as d3 from "d3"

require('./Axis.scss')
const orientations = {
  x: "bottom",
  y: "left"
}
const axesMap = {
  top: "axisTop",
  left: "axisLeft",
  right: "axisRight",
  bottom: "axisBottom",
}

class Axis extends Component {
  constructor(props) {
    super(props)
    this.state = {
      axis: null
    }
  }

  static propTypes = {
    chart: PropTypes.object,
    scale: PropTypes.string,
    dimension: PropTypes.oneOf(["x", "y"]),
    orientation: PropTypes.oneOf(["left", "right", "top", "bottom"]),
    ticks: PropTypes.number,
    tickSize: PropTypes.number,
    tickSizeInner: PropTypes.number,
    tickSizeOuter: PropTypes.number,
    tickFrequency: PropTypes.number,
    tickArguments: PropTypes.array,
    format: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.number,
    ]),
    initTransition: PropTypes.number,
    transition: PropTypes.number,
    label: PropTypes.string
  };

  static defaultProps = {
    ticks: 6,
    tickSize: 0,
    tickSizeInner: 6,
    tickSizeOuter: 0,
    initTransition: 300,
    transition: 300
  };

  getStyle() {
    let {chart, dimension} = this.props
    if (!chart || !chart.props || !chart.state) return
    let x = dimension == "x" ?
              0 :
              chart.props.margin.left ?
                1 :
                chart.state.width
    let y = dimension == "x" ?
              chart.state.height :
              0

    return {
      transform: `translate3d(${x}px, ${y}px, 0)`
    }
  }

  getOrientation() {
    let {dimension, orientation} = this.props
    return orientation || orientations[this.props.dimension] || "left"
  }

  update(props) {
    let {chart, scale, tickSize, tickSizeInner, tickSizeOuter, ticks, tickFrequency, tickPadding, tickArguments, format, initTransition, transition} = props
    let {axis} = this.state
    let {elem} = this.refs
    if (!scale || !chart || !chart.state || !chart.state.scales || !chart.state.scales[scale]) return

    let init = !axis
    if (init) axis = d3[axesMap[this.getOrientation()]]()

    axis.scale(chart.state.scales[scale])
        .tickSize(tickSize)
        .tickSizeInner(tickSizeInner)
        .tickSizeOuter(tickSizeOuter)

    if (tickArguments) axis.tickArguments(tickArguments)
    if (format) axis.tickFormat(format)
    if (ticks) axis.ticks(ticks, tickFrequency)
    if (tickPadding) axis.tickPadding(tickPadding)

    d3.select(elem)
      .transition().duration(init ? initTransition : transition)
      .call(axis)

    this.setState({axis})
  }

  componentDidMount() {
    this.update(this.props)
  }

  componentWillReceiveProps(newProps) {
    this.update(newProps)
  }

  renderLabel() {
    let {chart, dimension, label} = this.props
    let x =      dimension == "x" ? chart && chart.state && chart.state.width || 0 : 0
    let y =      dimension == "x" ? -10 : 20
    let rotate = dimension == "x" ? 0 : -90

    let style = {
      transform: `rotate(${rotate}deg)`,
    }
    return <text
             className={`Axis__label Axis--${dimension ? `${dimension}__` : ''}label`}
             style={style}
             x={x}
             y={y}>
      {label}
    </text>
  }

  getClassName() {
    let {dimension} = this.props

    return classNames(
      "Axis", {
        [`Axis--${dimension}`]: dimension,
      },
      this.props.className
    )
  }

  render() {
    let {label} = this.props

    return (
      <g ref="elem" className={this.getClassName()} style={this.getStyle()}>
        {!!label && this.renderLabel()}
      </g>
    )
  }
}

export default Axis
