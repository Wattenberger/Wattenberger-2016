import React, {Component} from "react"
import classNames from "classnames"
import * as d3 from "d3"
import Chart from "components/_ui/Chart/Chart"
import Scatter from "components/_ui/Chart/Scatter/Scatter"

require('./Day1.scss')

let interval
const INTERVAL_LENGTH = 90
const CHART_HEIGHT = 200
const MAX_MOVEMENT = 10
const MAX_RADIUS = 60
let dots = []
_.times(160, i => {
  const speed = _.random(2, 10, true)
  const dir = _.random(2 * Math.PI, true)

  let dot = {
    x: window.innerWidth / 2,
    y: CHART_HEIGHT / 2,
    speed: speed,
    dir: dir,
    dx: speed * Math.cos(dir),
    dy: speed * Math.sin(dir),
    rx: Math.cos(.03),
    ry: Math.sin(.03),
    r: _.random(2, MAX_RADIUS),
  }
  dots.push(dot)
})

class Day1 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 400,
      width: window.innerWidth,
      chart: {},
      dots: dots,
    }
  }

  getClassName() {
    return classNames("Day1")
  }

  componentDidMount() {
    this.setState({chart: this.chart})
    interval = window.setInterval(this.moveDots, INTERVAL_LENGTH)
    let {filter1, filter2, filter3} = this.refs
    filter1.setAttribute("in", "SourceGraphic")
    filter1.setAttribute("stdDeviation", "16")
    filter1.setAttribute("result", "blur")
    filter2.setAttribute("in", "blur")
    filter2.setAttribute("mode", "matrix")
    filter2.setAttribute("values", "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7")
    filter2.setAttribute("result", "goo")
    filter3.setAttribute("in", "SourceGraphic")
    filter3.setAttribute("in2", "goo")
    // filter3.setAttribute("result", "goo")
    filter3.setAttribute("operator", "atop")
  }

  componentWillUnmount() {
    window.clearInterval(interval)
  }

  movement(pos, bound, padding = 0) {
    let sign = pos >= bound - padding ? -1 :
               pos <= padding         ?  1 :
               _.random()             ?  1 : -1

    return _.random(MAX_MOVEMENT, true) * sign
  }

  movementFromDir(dot) {
    let {height, width} = this.state
    const padding = 0

    // dot.dir += 0.03
    // dot.dx = dot.speed * Math.cos(dot.dir)
    // dot.dy = dot.speed * Math.sin(dot.dir)
    dot.dx = dot.dx * dot.rx - dot.dy * dot.ry
    dot.dy = dot.dy * dot.rx + dot.dx * dot.ry

    if (dot.x + dot.dx >= width - padding) dot.dx = -dot.dx
    if (dot.x + dot.dx <= padding) dot.dx = -dot.dx
    dot.x = dot.x + dot.dx

    if (dot.y + dot.dy >= height - padding) dot.dy = -dot.dy
    if (dot.y + dot.dy <= padding) dot.dy = -dot.dy
    dot.y = dot.y + dot.dy
  }

  moveDots = () => {
    let {dots, height, width} = this.state
    const pctChangeChangeDir = 0.01

    dots = dots.map(dot => {
      this.movementFromDir(dot)
      return dot
    })
    this.setState({dots})
  }
  //
  // getWidth() {
  //   return window.innerWidth
  // }

  render() {
    let {chart, dots, height, width} = this.state

    return (
      <div className={this.getClassName()}>
        <Chart
          height={height}
          width={width}
          ref={Chart => this.chart = Chart}
        >
          <filter id="goo">
            <feGaussianBlur ref="filter1" />
            <feColorMatrix ref="filter2" />
            <feBlend ref="filter3" />
          </filter>
          <Scatter
            chart={chart}
            data={dots}
            xAccessor={d => d.x}
            yAccessor={d => d.y}
            radius={d => d.r}
            transition={INTERVAL_LENGTH}
            easing={d3.linear}
          />
        </Chart>
      </div>
    )
  }
}

export default Day1
