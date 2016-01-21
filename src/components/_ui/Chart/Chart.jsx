import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import numeral from "numeral"
import {flatten, clone, isDate} from "lodash"
import d3 from "d3"
import ChartPath from "./ChartPath/ChartPath"
import Bars from "./Bars/Bars"
import Axis from "./Axis/Axis"
import Brush from "./Brush/Brush"
import ChartTooltip from "./ChartTooltip/ChartTooltip"

require('./Chart.scss')
const clipPathExtension = 2
const transitionDuration = 100

class Chart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      parsedData: [],
      height: this.props.height,
      width: this.props.width,
      isLoaded: false,
      extent: null,
      hoveredPoint: {},
      xScale: () => {},
      brushXScale: () => {}
    }
  }

  static propTypes = {
    data: PropTypes.array,
    height: PropTypes.number,
    width: PropTypes.number,
    axesHeights: PropTypes.object,
    brushHeight: PropTypes.number,
    valueKeyX: PropTypes.string,
    valueKeyY: PropTypes.string,
    line: PropTypes.bool,
    area: PropTypes.bool,
    brush: PropTypes.bool,
    bar: PropTypes.bool,
    xAxis: PropTypes.bool,
    yAxis: PropTypes.bool,
    xAxisLabel: PropTypes.string,
    yAxisLabel: PropTypes.string,
    xAxisFormatting: PropTypes.func,
    yAxisFormatting: PropTypes.func,
    xAxisScale: PropTypes.func,
    yAxisScale: PropTypes.func,
    xDomain: PropTypes.array,
    hasTooltip: PropTypes.bool,
    renderTooltip: PropTypes.func,
    onBarClick: PropTypes.func,
    selectedPoint: PropTypes.object
  };

  static defaultProps = {
    data: [],
    height: 200,
    width: 600,
    axesHeights: {
      x: 30,
      y: 30
    },
    brushHeight: 16,
    parseData: (d) => d,
    valueKeyX: "date",
    valueKeyY: "count",
    xAxis: true,
    yAxis: true,
    xAxisScale: d3.time.scale,
    yAxisScale: d3.scale.linear,
    yAxisFormatting: (d) => numeral(d).format('0,0a'),
    renderTooltip: (hoveredPoint) => <h3>{hoveredPoint.xValue}</h3>,
    onBarClick: () => {}
};

  getClassName() {
    return classNames("Chart", this.props.className)
  }

  getHeight() {
    let {height, axesHeights} = this.props

    height = height - axesHeights.x
    if (this.props.brush) height -= this.props.brushHeight + axesHeights.y
    return height
  }

  getWidth() {
    let {width, axesHeights} = this.props

    return width - axesHeights.y
  }

  parseData(props) {
    let {data, valueKeyX, valueKeyY} = props
    if (!data) {
      this.setState({parsedData: []})
      return
    }

    let parsedData
    if (data[0].values) {
      parsedData = clone(data)
      parsedData.map(series => {
        series.values = series.values.map(d => {
          d.xVal = d[valueKeyX]
          d.yVal = +d[valueKeyY]
          return d
        })
        return series
      })
    } else {
      parsedData = clone(data).map(d => ({
        xVal: d[valueKeyX],
        yVal: +d[valueKeyY]
      }))
    }

    this.setState({parsedData: parsedData})
    setTimeout(() => {
      this.setScales()
    }, 0)
  }

  getFlattenedValues(data) {
    if (!data) return []
    return flatten(data.map(d => d.values))
  }

  getAxisRange(axis) {
    if (axis === "x") return [0, this.getWidth()]
    if (axis === "y") return [this.getHeight(), 0]
  }

  getAxisDomain(axis, isBrush, currentExtent) {
    let {parsedData} = this.state
    currentExtent = currentExtent || this.state.currentExtent
    let {xDomain} = this.props
    if (!parsedData[0]) return []

    if (axis === "x") {
      return isBrush && currentExtent
        ? currentExtent
        : !!parsedData[0].values
          ? d3.extent(parsedData[0] && parsedData[0].values ? this.getFlattenedValues(parsedData) : parsedData, d => d.xVal)
          : xDomain || d3.extent(parsedData, d => d.xVal)
    }
    if (axis === "y") return [0, d3.max(parsedData[0] && parsedData[0].values ? this.getFlattenedValues(parsedData) : parsedData, d => d.yVal)]
  }

  getAxisScale(axis, isBrush) {
    let scaleRange = this.getAxisRange(axis)
    let scaleDomain = this.getAxisDomain(axis, isBrush)
    let scale = this.props[axis + "AxisScale"]()
      .range(scaleRange)
    if (scaleDomain.length) scale.domain(scaleDomain)
    return scale
  }

  getAxisStyle(axis) {
    return {
      transform: axis === "x" ? "translate3d(0, " + this.getHeight() + "px, 0)" : "rotate(-90)",
      WebkitTransform: axis === "x" ? "translate3d(0, " + this.getHeight() + "px, 0)" : "rotate(-90)"
    }
  }

  getFillClipPathStyle() {
    let {axesHeights} = this.props

    return {
      height: this.getHeight(),
      width: this.getWidth(),
      marginLeft: axesHeights.x,
      marginTop: 0
    }
  }

  getBrushStyle(axis) {
    let {axesHeights} = this.props

    let yOffset = this.getHeight() + axesHeights.y + 4
    return {
      transform: "translate3d(0, " + yOffset + "px, 0)",
      WebkitTransform: "translate3d(0, " + yOffset + "px, 0)"
    }
  }

  getStyle() {
    let {axesHeights} = this.props

    return {
      transform: "translate3d(" + axesHeights.x + "px, 0, 0)",
      WebkitTransform: "translate3d(" + axesHeights.x + "px, 0, 0)"
    }
  }

  setSize() {
    let el = this.refs.el
    if (el.offsetHeight) this.setState({height: (el.offsetHeight - 6)})
    if (el.offsetWidth) this.setState({width: el.offsetWidth})
    this.setScales()
  }

  setScales(props) {
    this.setState({xScale: this.getAxisScale("x")})
    this.setState({yScale: this.getAxisScale("y")})
    if (this.props.brush) this.setState({brushXScale: this.getAxisScale("x", true)})
  }

  onBrush(newExtent) {
    let {parsedData, xScale} = this.state
    let xScaleIsDate = isDate(xScale.domain()[0])

    let data = parsedData
    if (xScaleIsDate) {
      if (new Date(newExtent[0]) + "" === new Date(newExtent[1]) + "") newExtent = d3.extent(data, d => d.xVal)
    } else {
      if (newExtent[0] === newExtent[1]) newExtent = null
    }
    this.setState({currentExtent: newExtent})
    xScale.domain(this.getAxisDomain("x", true, newExtent))
    this.setState({xScale})
  }

  clearExtent() {
    this.onBrush(this.getAxisDomain("x"))
  }

  componentWillReceiveProps(newProps) {
    this.clearExtent()
    if (this.props.data != newProps.data) this.parseData(newProps)
  }

  componentWillMount() {
    this.parseData(this.props)
    this.setScales()
  }

  componentDidMount() {
    this._setSize = ::this.setSize
    this._setSize()
    window.addEventListener("resize", this._setSize)
    setTimeout(() => {
      this.setState({isLoaded: true})
    }, 0)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this._setSize)
  }

  setHoveredPoint(hoveredPoint) {
    this.setState({hoveredPoint})
  }

  renderClipPath() {
    let {isLoaded} = this.state

    return <defs>
      <clipPath id="chartPath-clip">
        <rect className="Chart__clip-path"
          x={-clipPathExtension}
          y={0}
          height={this.getHeight() + clipPathExtension * 3}
          width={isLoaded ? this.getWidth() + clipPathExtension * 2 : 0}
          />
        </clipPath>
      </defs>
  }

  renderChartPath(type) {
    let {selectedSeries, filtered} = this.props
    let {parsedData, xScale, yScale, hoveredPoint} = this.state

    if (parsedData[0].values) {
      return parsedData.map((series, idx) =>
        <ChartPath
          data={series.values}
          type={type}
          height={this.getHeight()}
          xScale={xScale}
          yScale={yScale}
          color={series.color}
          hoveredPoint={hoveredPoint}
          transitionDuration={transitionDuration}
          selected={selectedSeries === series}
          filtered={series.filtered}
          key={idx}
        />
        )
    } else {
      return <ChartPath
        data={parsedData}
        type={type}
        height={this.getHeight()}
        xScale={xScale}
        yScale={yScale}
        hoveredPoint={hoveredPoint}
        transitionDuration={transitionDuration} />
    }
  }

  renderBars() {
    let {onBarClick} = this.props
    let {parsedData, xScale, yScale} = this.state

    return <Bars
      data={parsedData}
      height={this.getHeight()}
      xScale={xScale}
      yScale={yScale}
      transitionDuration={transitionDuration}
      onBarClick={onBarClick} />
  }

  renderAxis(axis, tickNumber) {
    return <g style={this.getAxisStyle(axis)}>
      <Axis
        axis={axis}
        scale={axis === "x" ? this.state.xScale : this.getAxisScale(axis)}
        range={this.getAxisRange(axis)}
        domain={this.getAxisDomain(axis)}
        formatting={this.props[axis + "AxisFormatting"]}
        tickNumber={tickNumber}
        transitionDuration={transitionDuration} />
    </g>
  }

  renderBrush() {
    let {brushHeight, xAxisFormatting} = this.props
    let {brushXScale} = this.state

    return <g style={this.getBrushStyle()}>
      <Brush
        height={brushHeight}
        width={this.getWidth()}
        xScale={brushXScale}
        xAxisFormatting={xAxisFormatting}
        transitionDuration={transitionDuration}
        onChange={::this.onBrush}/>
    </g>
  }

  renderTooltipElem() {
    let {xAxisFormatting, renderTooltip} = this.props
    let {parsedData, xScale, yScale, hoveredPoint} = this.state

    return <div className="Chart__tooltip-container" style={this.getFillClipPathStyle()}>
      <ChartTooltip
        data={parsedData}
        xScale={xScale}
        yScale={yScale}
        xAxisFormatting={xAxisFormatting}
        renderTooltip={renderTooltip}
        hoveredPoint={hoveredPoint}
        onTooltipChange={::this.setHoveredPoint}
    />
    </div>
  }

  render() {
    let {height, width, children, line, area, bar, xAxis, yAxis, brush, hasTooltip} = this.props

    return (
      <div ref="el" className={this.getClassName()}>
        <svg className="Chart__svg" height={height} width={width}>
          {this.renderClipPath()}
          <g style={this.getStyle()}>
            <g clipPath="url(#chartPath-clip)">
              {children}
              {area && this.renderChartPath("area")}
              {(area || line) && this.renderChartPath("line")}
              {bar && this.renderBars("bar")}
            </g>
            {xAxis && this.renderAxis("x", 8)}
            {yAxis && this.renderAxis("y", 4)}
            {brush && this.renderBrush()}
            {hasTooltip && this.renderTooltipElem()}
          </g>
        </svg>
      </div>
    )
  }
}

export default Chart
