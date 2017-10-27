import React, {Component} from "react"
import PropTypes from "prop-types"
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
    chartInfo: PropTypes.object,
    scale: PropTypes.func,
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
    let {chartInfo, dimension} = this.props
    let x = dimension == "x" ?
              0 :
              chartInfo.margin.left ?
                1 :
                chartInfo.width
    let y = dimension == "x" ?
              chartInfo.height - chartInfo.margin.bottom :
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
    let {scale, label, tickSize, tickSizeInner, tickSizeOuter, ticks, tickFrequency, tickPadding, tickArguments, format, initTransition, transition} = (props || this.props)
    let {axis} = this.state
    let {elem} = this.refs
    if (!scale) return

    let init = !axis
    if (init) axis = d3[axesMap[this.getOrientation()]]()
    
    axis.scale(scale)
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
    this.update()
  }

  componentWillReceiveProps(newProps) {
    this.update(newProps)
  }

  renderLabel() {
    let {dimension, label, chartInfo} = this.props
    let x =      dimension == "x" ? chartInfo.width || 0 : 0
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
    let {dimension, className} = this.props

    return classNames(
      "Axis", {
        [`Axis--${dimension}`]: dimension,
      },
      className
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
