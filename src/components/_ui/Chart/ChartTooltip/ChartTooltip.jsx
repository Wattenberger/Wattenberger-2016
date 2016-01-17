import React, {Component, PropTypes} from "react"
import {findDOMNode} from "react-dom"
import classNames from "classnames"
import {clone, isDate} from "lodash"

require('./ChartTooltip.scss')

const findClosestIndex = (point, arr) => {
  let closestPointIndex
  let closestPointDistance
  arr.map((d, idx) => {
    let distance = Math.abs(point - d)
    if (!closestPointDistance || distance < closestPointDistance) {
      closestPointIndex = idx
      closestPointDistance = distance
    }
  })
  return closestPointIndex
}

class ChartTooltip extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hoveredPoint: {},
      showTooltip: false
    }
  }
  static propTypes = {
    data: PropTypes.array,
    xScale: PropTypes.func,
    yScale: PropTypes.func,
    xAxisFormatting: PropTypes.func,
    renderTooltip: PropTypes.func
  };

  static defaultProps = {
    data: [],
    height: 200,
  };

  updateTooltip() {
    let {data, xScale, yScale, xAxisFormatting} = this.props
    this.setState({showTooltip: true})

    let elem = findDOMNode(this.refs.eventListenerDiv)
    let xScaleIsDate = isDate(xScale.domain()[0])
    let d
    let mouseX = xScale.invert(d3.mouse(elem)[0])

    if (xScaleIsDate) {
      let reversedData = clone(data).reverse()

      let bisectDate = d3.bisector(d => d.xVal).left
      let i = bisectDate(reversedData, mouseX, 1),
        d0 = reversedData[i - 1],
        d1 = reversedData[i]
      d = mouseX - d0.date > d1.date - mouseX ? d1 : d0
    } else {
      d = data[findClosestIndex(mouseX, data.map(d => d.xVal))]
    }

      let hoveredPoint = {
        x: xScale(d.xVal),
        y: yScale(d.yVal),
        xValue: d.xVal,
        yValue: d.yVal
      }

      this.setState({hoveredPoint})
  }

  hideTooltip() {
    this.setState({showTooltip: false})
  }

  componentDidMount() {
    d3.select(findDOMNode(this.refs.eventListenerDiv))
      .on("mousemove", ::this.updateTooltip)
      .on("mouseout", ::this.hideTooltip)
  }

  getClassName() {
    return classNames("ChartTooltip", this.props.className)
  }

  render() {
    let {renderTooltip} = this.props
    let {hoveredPoint, showTooltip} = this.state

    return (
      <div className={this.getClassName()}>
        <div className="ChartTooltip__container">
          <div className="ChartTooltip__content" style={{left: hoveredPoint.x, top: hoveredPoint.y, opacity: showTooltip ? 1 : 0}}>
            <div direction="top">
              {renderTooltip(hoveredPoint)}
            </div>
          </div>
        </div>
        <div className="ChartTooltip__container" ref="eventListenerDiv"></div>
      </div>
    )
  }
}

export default ChartTooltip
