import React, {Component} from "react"
import * as d3 from "d3"
import numeral from "numeral"
import { interpolatePRGn } from "d3-scale-chromatic"
import classNames from "classnames"
import _ from "lodash"
import { createScale } from 'components/_ui/Chart/utils/scale';
import RadioGroup from 'components/_ui/RadioGroup/RadioGroup';

import Chart from "components/_ui/Chart/Chart"
import Axis from "components/_ui/Chart/Axis/Axis"
import Scatter from "components/_ui/Chart/Scatter/Scatter"

// import data from "./WDVP Datasets - the future of government"
import rawData from "./Wdvp_gov_score.json"
import metricRankedCorrelationData from "./Wdvp_corr.json"
// import data from "./WDVP Datasets - small countries are beautiful"

import './WDVPScatter.scss'

console.log(rawData)

const formatNumber = d => numeral(d).format("0,0")
const ordinalColors = ["#63cdda", "#cf6a87", "#786fa6", "#FDA7DF", "#4b7bec", "#778ca3"]; // "#e77f67", "#778beb", 
const numberFromValue = value =>
  _.isFinite(value) ? value : 
  _.isString(value) ? +value.replace(/,/g, "") :
  null

let continents = [
  {code: "AS", value: "Asia",          color: "#12CBC4"}, // #EF4E78, "#63cdda"
  {code: "EU", value: "Europe",        color: "#B53471"}, // #F99072, "#cf6a87"
  {code: "AF", value: "Africa",        color: "#F79F1F"}, // #FFCA81, "#e77f67"
  {code: "NA", value: "North America", color: "#5758BB"}, // #98C55C, "#FDA7DF"
  {code: "OC", value: "Oceania",       color: "#1289A7"}, // #67B279, "#4b7bec"
  {code: "SA", value: "South America", color: "#A3CB38"}, // #6F87A6, "#778beb"
]
const continentColors = _.fromPairs(_.map(continents, continent => [
  continent.code,
  continent.color,
]))
class WDVPScatter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scales: {},
      hoveredCountry: null,
      height: Math.min(window.innerWidth, 500),
      width: Math.min(window.innerWidth, 500),
      margin: {
        top: 20,
        right: 20,
        bottom: 50,
        left: 50,
      },
      iterator: 0,
    }
  }
  chart = React.createRef()
  scatter = React.createRef()

  getClassName() {
    return classNames("WDVPScatter", this.props.className)
  }

  componentDidMount() {
    this.createScales()
  }

  componentDidUpdate(prevProps) {
    if (this.props.data != prevProps.data || this.props.xMetric != prevProps.xMetric || this.props.yMetric != prevProps.yMetric) this.createScales()
  }

  createScales = () => {
    const { xMetric, yMetric, data } = this.props
    const { height, width, margin, iterator } = this.state

    const scales = {
      x: createScale({
        domain: d3.extent(data, this.xAccessor),
        width,
        margin,
      }),
      y: createScale({
        domain: d3.extent(data, this.yAccessor),
        height,
        margin,
        dimension: "y",
      }),
    }

    this.setState({ scales, iterator: iterator + 1 })
  }

  onDotsUpdate = dots => {
    dots.style("fill", d => continentColors[d.Continent])
      .style("opacity", 1)
      // .style("transition", "all 0.9s ease-out")
  }

  onCountryHover = country => this.setState({ hoveredCountry: country })
  xAccessor = d => d[[`${this.props.xMetric}__percentile`]]
  yAccessor = d => d[[`${this.props.yMetric}__percentile`]]
  xAccessorScaled = d => this.state.scales.x && this.state.scales.x(this.xAccessor(d))
  yAccessorScaled = d => this.state.scales.y && this.state.scales.y(this.yAccessor(d))
  keyAccessor = d => d.Country

  render() {
    const { data, xMetric, yMetric } = this.props
    const { height, width, margin, scales, iterator } = this.state

    return (
      <div className={this.getClassName()}>
        <Chart
          height={height}
          width={width}
          margin={margin}
          ref={this.chart}
        >
          <Axis
            dimension="x"
            height={height}
            width={width}
            margin={margin}
            scale={scales.x}
            format={formatNumber}
            label={xMetric}
          />
          <Axis
            dimension="y"
            height={height}
            margin={margin}
            scale={scales.y}
            format={formatNumber}
            label={yMetric}
          />
          <Scatter
            chart={this.chart}
            data={data}
            radius={5}
            xAccessor={this.xAccessorScaled}
            yAccessor={this.yAccessorScaled}
            dataKey={this.keyAccessor}
            iterator={iterator}
            transition={900}
            onUpdate={this.onDotsUpdate}
            ref={this.scatter}
          />
        </Chart>
      </div>
    )
  }
}

export default WDVPScatter