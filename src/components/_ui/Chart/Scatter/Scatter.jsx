import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import * as d3 from "d3"

require('./Scatter.scss')
const orientations = {
  x: "bottom",
  y: "left"
}

class Scatter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dots: null
    }
  }

  static propTypes = {
    id: PropTypes.string,
    chart: PropTypes.object,
    data: PropTypes.array,
    radius: PropTypes.number,
    xAccessor: PropTypes.func,
    yAccessor: PropTypes.func,
    dataKey: PropTypes.func,
    initTransition: PropTypes.number,
    transition: PropTypes.number,
    onUpdate: PropTypes.func,
  };

  static defaultProps = {
    id: "scatter",
    dataKey: _.noop,
    radius: 8,
    initTransition: 1300,
    transition: 300,
    onUpdate: _.noop,
  };

  update(props) {
    let {id, chart, data, radius, xAccessor, yAccessor, dataKey, initTransition, transition, onUpdate} = props
    let {dots} = this.state
    let {elem} = this.refs
    if (!chart) return

    let init = !dots
    dots = d3.select(elem).selectAll(".dot")
      .data(data, dataKey)
    dots.enter().append("circle")
      .attr("class", "dot")
    if (init) dots.attr("r", 0)

    dots.transition().duration(init ? initTransition : transition)
        .attr("r", radius)
        .attr("cx", xAccessor)
        .attr("cy", yAccessor)

    dots.exit().remove()

    this.setState({dots})
    onUpdate(dots)
  }

  componentDidMount() {
    this.update(this.props)
  }

  componentWillReceiveProps(newProps) {
    this.update(newProps)
  }

  getClassName() {
    let {id} = this.props
    return classNames(
      "Scatter",
      `Scatter__${id}`,
      this.props.className
    )
  }

  render() {
    return (
      <g ref="elem" className={this.getClassName()}>
      </g>
    )
  }
}

export default Scatter
