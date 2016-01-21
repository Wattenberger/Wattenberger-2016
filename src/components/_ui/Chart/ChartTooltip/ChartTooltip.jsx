import React, {Component, PropTypes} from "react"
import {findDOMNode} from "react-dom"
import classNames from "classnames"
import {clone, isDate, filter, merge} from "lodash"

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
      showTooltip: false
    }
  }
  static propTypes = {
    data: PropTypes.array,
    xScale: PropTypes.func,
    yScale: PropTypes.func,
    hoveredPoint: PropTypes.object,
    xAxisFormatting: PropTypes.func,
    renderTooltip: PropTypes.func,
    onTooltipChange: PropTypes.func
  };

  static defaultProps = {
    data: [],
    height: 200,
    onTooltipChange: () => {}
  };

  updateTooltip() {
    let {data, xScale, yScale, xAxisFormatting} = this.props
    this.setState({showTooltip: true})

    let elem = findDOMNode(this.refs.eventListenerDiv)
    let xScaleIsDate = isDate(xScale.domain()[0])
    let d
    let mouseX = xScale.invert(d3.mouse(elem)[0])
    let mouseY = yScale.invert(d3.mouse(elem)[1])

    if (xScaleIsDate) {
      let reversedData = clone(data).reverse()

      let bisectDate = d3.bisector(d => d.xVal).left
      let i = bisectDate(reversedData, mouseX, 1),
        d0 = reversedData[i - 1],
        d1 = reversedData[i]
      d = mouseX - d0.date > d1.date - mouseX ? d1 : d0
    } else {
      if (!!data[0].values) {
        let xVal = data[0].values[findClosestIndex(mouseX, data[0].values.map(d => d.xVal))].xVal
        let closestPoint = {}
        let closestPointDistance
        data.map(series => {
          if (series.filtered) return
          let yearInSeries = _.filter(series.values, d => d.xVal === xVal)[0]
          let distance = Math.abs((yearInSeries ? yearInSeries.yVal : 0) - mouseY || 0)
          if (!closestPointDistance || distance < closestPointDistance) {
            closestPoint = merge(series, yearInSeries)
            closestPointDistance = distance
          }
        })
        d = closestPoint
      } else {
        d = data[findClosestIndex(mouseX, data.map(d => d.xVal))]
      }
    }

      let hoveredPoint = {
        x: xScale(d.xVal),
        y: yScale(d.yVal),
        xValue: d.xVal,
        yValue: d.yVal
      }

      this.props.onTooltipChange(merge(d, hoveredPoint))
  }

  hideTooltip() {
    this.setState({showTooltip: false})
    this.props.onTooltipChange({})
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
    let {renderTooltip, hoveredPoint} = this.props
    let {showTooltip} = this.state

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
