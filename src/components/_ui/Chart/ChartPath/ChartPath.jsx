import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import * as d3 from "d3"

require('./ChartPath.scss')

class ChartPath extends Component {
  static propTypes = {
    data: PropTypes.array,
    type: PropTypes.string,
    height: PropTypes.number,
    xScale: PropTypes.func,
    yScale: PropTypes.func,
    color: PropTypes.string,
    hoveredPoint: PropTypes.object,
    transitionDuration: PropTypes.number,
    selected: PropTypes.bool,
    filtered: PropTypes.bool
  };

  static defaultProps = {
    data: [],
    height: 200,
    hoveredPoint: {}
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

  getLineStyle() {
    let {type, data, color, hoveredPoint, selected, filtered} = this.props
    if (!color) return
    let style = {}

    if (type === "area") style.fill = color
    if (type === "line") style.stroke = color
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
    let {data, hoveredPoint, selected, filtered} = this.props

    return classNames("ChartPath", {
      "ChartPath--filtered": filtered,
      "ChartPath--selected": selected,
      "ChartPath--hovered": hoveredPoint.values === data
    }, this.props.className)
  }

  render() {
    return (
      <g className={this.getClassName()}>
        <path ref="path" className={"ChartPath__" + this.props.type} style={this.getLineStyle()} />
      </g>
    )
  }
}

export default ChartPath
