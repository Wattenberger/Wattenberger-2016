import React, {Component} from "react"
import { FixedSizeList as List } from 'react-window'
import * as d3 from "d3"
import numeral from "numeral"
import classNames from "classnames"
import _ from "lodash"
import Tooltip from "components/_ui/Tooltip/Tooltip"
import Button from "components/_ui/Button/Button"
import Chart from 'components/_ui/Chart/Chart';
import { createScale } from 'components/_ui/Chart/utils/scale';
import Line from 'components/_ui/Chart/Line/Line';
import Axis from 'components/_ui/Chart/Axis/Axis';
import RadioGroup from 'components/_ui/RadioGroup/RadioGroup';

// import data from "./WDVP Datasets - the future of government"
import rawData from "./WDVP Datasets - what makes a 'good' government.json"
// import data from "./WDVP Datasets - small countries are beautiful"

import './WDVPGrid.scss'

console.log(rawData)

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
const interpolatedColorScale = createScale({
  domain: [0, continents.length - 1],
  range: ["#63cdda", "#cf6a87"]
})
const blackAndWhiteColorScale = createScale({
  domain: [0, 1],
  range: ["#dff9fb", "#130f40"]
})
const highlightColorScale = createScale({
  domain: [0, 1],
  range: ["#fff", "#45aeb1"]
})
continents = _.map(continents, (continent, i) => ({...continent, color: interpolatedColorScale(i)}))
console.log(continents)
const continentColorScales = _.fromPairs(
  _.map(continents, continent => [
    continent.code,
    createScale({
      domain: [0, 1],
      range: ["#fff", continent.color],
    }),
  ])
)
const rankOrRawOptions = [{
  value: true,
  label: "Rank",
},{
  value: false,
  label: "Value",
}]
const metrics = [
  "population", "surface area (Km2)", "happy planet index", "human development index", "world happiness report score", "sustainable economic development assessment (SEDA)", "GDP (billions PPP)", "GDP per capita (PPP)", "GDP growth (annual %)", "health expenditure % of GDP", "health expenditure per person", "school life expectancy (years)", "unemployment (%)", "government spending score", "government expenditure (% of GDP)", "political rights score", "civil liberties score", "political stability & absence of violence", "government effectiveness", "regulatory quality", "rule of law", "control of corruption", "judicial effectiveness score", "government integrity score", "property rights score", "tax burden score", "overall economic freedom score", "financial freedom score", "women MPs (% of all MPs)", "Area in km²",
  // "education expenditure % of GDP", "education expenditure per person",
]
const metricsColorScale = createScale({
  domain: [0, metrics.length - 1],
  range: ["#63cdda", "#e77f67"],
})
class WDVPGrid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scales: {},
      sort: metrics[0],
      processedData: [],
      selectedContinents: [],
      hoveredCountry: null,
      isAscending: true,
      isShowingRank: true,
    }
  }

  getClassName() {
    return classNames("WDVPGrid", this.props.className)
  }

  componentDidMount() {
    this.createScales()
  }
  chart = React.createRef()

  createScales = () => {
    const { sort, selectedContinents, isAscending, isShowingRank } = this.state

    const selectedContinentValues = _.map(selectedContinents, "code")

    const sortedData = _.orderBy(
      rawData,
      [d => d[`${sort}__rank`]],
      [isAscending ? "asc" : "desc"]
    )
    const filteredData = _.isEmpty(selectedContinents) ? sortedData :
      _.filter(sortedData, d => _.includes(selectedContinentValues, d.Continent))

    const scales = _.fromPairs(
      _.map(metrics, (metric, i) => [
        metric,
        createScale({
          domain: d3.extent(sortedData, d => d[metric]),
          range: [0, 1],
        }),
      ])
    )
    this.setState({ scales, processedData: filteredData })
  }

  onChangeSort = metric => () => metric == this.state.sort ?
    this.setState({ isAscending: !this.state.isAscending }, this.createScales) :
    this.setState({ sort: metric, isAscending: this.state.isShowingRank ? true : false }, this.createScales)
    
  onContinentsSelect = continents => this.setState({ selectedContinents: continents }, this.createScales)
  onIsShowingRankSelect = newVal => this.setState({ isShowingRank: newVal.value, isAscending: !this.state.isAscending }, this.createScales)
  onCountryHover = country => this.setState({ hoveredCountry: country })

  render() {
    const { processedData, selectedContinents, scales, sort, hoveredCountry, isAscending, isShowingRank } = this.state

    return (
      <div className={this.getClassName()}>
        <h2 className="WDVPGrid__title">
          Country Metric Explorer
        </h2>
        <div className="WDVPGrid__contents">
        
          <RadioGroup
            className="WDVPGrid__toggle"
            options={continents}
            value={selectedContinents}
            onChange={this.onContinentsSelect}
            isMulti
            canClear
          />
        
          <RadioGroup
            className="WDVPGrid__toggle"
            options={rankOrRawOptions}
            value={isShowingRank}
            onChange={this.onIsShowingRankSelect}
          />

          {/* <div className="WDVPGrid__header">
            {_.map(processedData, country => (
              <div
                key={country.Country}
                className={`WDVPGrid__header__item WDVPGrid__header__item--is-${hoveredCountry == country.Country ? "hovered" : "not-hovered"}`}>
                <div className="WDVPGrid__header__item__text">
                  { country.Country }
                </div>
              </div>
            ))}
          </div> */}
          
          <div className="WDVPGrid__chart">
            <div className="WDVPGrid__metrics">
              {_.map(metrics, metric => (
                <div
                  key={metric}
                  className={`WDVPGrid__metrics__item WDVPGrid__metrics__item--is-${sort == metric ? "selected" : "not-selected"}`}
                  onClick={this.onChangeSort(metric)}>
                  { metric }
                </div>
              ))}
            </div>
          
            <WDVPGridChart
              data={processedData}
              sort={sort}
              scales={scales}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default WDVPGrid


class WDVPGridChart extends Component {
  state = {
    width: window.innerWidth * 0.9,
    height: window.innerHeight * 0.9,
    margins: {
      top: 0,
      right: 0,
      bottom: 50,
      left: 160,
    }
  }
  container = React.createRef()

  componentDidMount() {
    this.createScales()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data != this.props.data) this.createScales()
  }

  createScales = () => {
    const { data } = this.props
    const { width, height, margins } = this.state
    const boundedHeight = height - margins.top - margins.bottom
    const boundedWidth = width - margins.left - margins.right
    const xScale = createScale({
      domain: [0, data.length],
      range: [0, boundedWidth],
    })
    const yScale = createScale({
      domain: [0, metrics.length],
      range: [boundedHeight, 0],
      orientation: "y",
    })
    this.setState({ xScale, yScale }, this.drawData)
  }

  drawData = () => {
    if (!this.container.current) return
    const { data, scales } = this.props
    const { width, height, margins, xScale, yScale } = this.state

    if (_.isEmpty(data)) return;

    const reformattedData = _.map(data, (country, countryIndex) => ({
      name: country.Country,
      metrics: _.map(metrics, (metric, metricIndex) => ({
        metric,
        countryIndex,
        metricIndex,
        scaledValue: scales[metric](country[metric]),
      })),
    }))

    const bounds = d3.select(this.container.current)
    const cellWidth = xScale(1) - xScale(0)
    const cellHeight = yScale(0) - yScale(1)
    
    const countries = bounds.selectAll(".WDVPGridChart__group")
        .data(reformattedData, d => d.name)
    countries.enter().append("g")
        .attr("class", "WDVPGridChart__group")

    const t = d3.transition()
        .duration(900)
        .ease(d3.easeLinear)
    const rects = bounds.selectAll(".WDVPGridChart__group").selectAll(".WDVPGridChart__rect")
        .data(d => d.metrics, d => d.metric)
    rects.enter().append("rect")
        .merge(rects)
        .attr("class", "WDVPGridChart__rect")
        .attr("y", d => yScale(d.metricIndex))
        .attr("width", cellWidth)
        .attr("height", cellHeight)
        .attr("fill", (d, i) => blackAndWhiteColorScale(d.scaledValue))

        .transition(t)
        .attr("x", d => xScale(d.countryIndex))
  }

  render () {
    const { data } = this.props
    const { width, height, margins, xScale, yScale } = this.state

    return (
      <svg height={height} width={width}>
        <g
          ref={this.container}
          style={{
            transform: `transform(${margins.top}px, ${margins.left}px)`,
          }}
        />
      </svg>
    )
  }
}