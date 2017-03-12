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
    data: PropTypes.array,
    radius: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.func,
    ]),
    xAccessor: PropTypes.func,
    yAccessor: PropTypes.func,
    dataKey: PropTypes.func,
    initTransition: PropTypes.number,
    transition: PropTypes.number,
    easing: PropTypes.func,
    onUpdate: PropTypes.func,
  };

  static defaultProps = {
    radius: 8,
    initTransition: 1300,
    transition: 300,
    easing: d3.easeBackOut,
    onUpdate: _.noop,
  };

  update = (props) => {
    let {data, radius, xAccessor, yAccessor, dataKey, initTransition, transition, easing, onUpdate} = (props || this.props)
    let {dots} = this.state
    let {elem} = this.refs
    
    let init = !dots
    dots = d3.select(elem).selectAll(".dot")
      .data(data, dataKey)
    dots.enter().append("circle")
      .attr("class", "dot")

    if (init) {
      dots.attr("r", 0)
          .attr("cx", xAccessor)
          .attr("cy", yAccessor)
    }

    dots.transition().duration(init ? initTransition : transition).ease(easing)
        .attr("r", radius)
        .attr("cx", xAccessor)
        .attr("cy", yAccessor)

    dots.exit().remove()

    this.setState({dots})
    onUpdate(dots)
  }

  componentDidMount() {
    this.update()
  }

  componentWillReceiveProps(newProps) {
    this.update(newProps)
  }

  getClassName() {
    return classNames(
      "Scatter",
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
