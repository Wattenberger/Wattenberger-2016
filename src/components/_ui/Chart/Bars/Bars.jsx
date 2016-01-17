import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import d3 from "d3"

require('./Bars.scss')

class Bars extends Component {
  static propTypes = {
    data: PropTypes.array,
    height: PropTypes.number,
    xScale: PropTypes.func,
    yScale: PropTypes.func,
    transitionDuration: PropTypes.number,
    onBarClick: PropTypes.func
  };

  static defaultProps = {
    data: [],
    height: 200
  };

  init() {
    let {data, xScale, yScale} = this.props
    let numBins = xScale.domain()[1] - xScale.domain()[0]

    let layout = d3.layout.histogram(data)
      .range(xScale.domain())
      .bins(xScale.ticks(numBins))
      (data)
  }

  update() {
    let {data, height, xScale, yScale} = this.props

    if (isNaN(xScale(data[0].xVal))) return
    let barWidth = xScale(1) - xScale(0)

    let bar = d3.select(this.refs.bars).selectAll('.bar')
        .data(data)

    bar.enter().append("rect")
      .attr("class", "bar")
      .attr("x", 1)
      .attr("width", barWidth)
      .attr("height", d => height - yScale(d.yVal))
      .on("click", ::this.onBarClick)

    bar.attr("transform", d => `translate(${xScale(d.xVal) - (barWidth / 2)},${yScale(d.yVal)})`)

    bar.data(data).exit().remove()
  }

  onBarClick(bar) {
    this.props.onBarClick(bar)
  }

  componentDidMount() {
    this.init()
    this.update()
  }

  componentWillReceiveProps(newProps) {
    this.update()
  }

  getClassName() {
    return classNames("Bars", this.props.className)
  }

  render() {
    let {data} = this.props
    return (
      <g className={this.getClassName()} ref="bars" />
    )
  }
}

export default Bars
