import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import d3 from "d3"

require('./ChartPath.scss')
const gradientStops = {
  line: [
    {offset: 0, color: "#ae1b3a"},
    {offset: 100, color: "#f4546e"},
  ],
  area: [
    {offset: 0, color: "#f4546e", opacity: "0.4"},
    {offset: 100, color: "#f4546e", opacity: "0"},
  ]
}

class ChartPath extends Component {
  static propTypes = {
    data: PropTypes.array,
    type: PropTypes.string,
    height: PropTypes.number,
    xScale: PropTypes.func,
    yScale: PropTypes.func,
    transitionDuration: PropTypes.number
  };

  static defaultProps = {
    data: [],
    height: 200,
  };

  update(props, duration, zero) {
    let {data, type, height, xScale, yScale} = props

    let path = d3.svg[type]()
      .interpolate("cardinal")
      .x(d => xScale(d.xVal))

    if (type === "area") {
      path.y0(height)
        .y1(d => zero ? this.props.height : yScale(d.yVal))
    }
    if (type === "line") {
      path.y(d => zero ? this.props.height : yScale(d.yVal))
    }

    d3.select(this.refs.path)
      .datum(data)
      .transition()
        .duration(duration)
        .attr("d", path)
  }

  getGradients() {
    let {type} = this.props
    let style = {}
    if (type === "area") style.fill = "url(#area-gradient)"
    if (type === "line") style.stroke = "url(#line-gradient)"
    return style
  }

  componentDidMount() {
    this.update(this.props)
  }

  componentWillReceiveProps(newProps) {
    if (this.props != newProps) {
      // this.update(this.props, this.props.transitionDuration, true)
      // setTimeout(() => {
      //   this.update(newProps, 0, true)
      //   setTimeout(() => {
          this.update(newProps, this.props.transitionDuration)
      //   }, 20)
      // }, this.props.transitionDuration)
    }
  }

  getClassName() {
    return classNames("ChartPath", this.props.className)
  }

  render() {
    return (
      <g className={this.getClassName()}>
        <linearGradient id={this.props.type + "-gradient"} x1="0%" y1="0%" x2="0%" y2="100%">
          {gradientStops[this.props.type].map((stop, idx) =>
            <stop
              key={idx}
              offset={stop.offset + "%"}
              stopColor={stop.color}
              stopOpacity={stop.opacity || 1}>
            </stop>
          )}
        </linearGradient>
        <path ref="path" className={"ChartPath__" + this.props.type} style={this.getGradients()} />
      </g>
    )
  }
}

export default ChartPath
