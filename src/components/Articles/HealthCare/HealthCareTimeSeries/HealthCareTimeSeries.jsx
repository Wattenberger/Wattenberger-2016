import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import numeral from "numeral"
import {filter} from "lodash"
import d3 from "d3"
import Select from "react-select"
import "react-select/dist/react-select.css"
import Flex from "components/_ui/Flex/Flex"
import Chart from "components/_ui/Chart/Chart"
import RadioGroup from "components/_ui/RadioGroup/RadioGroup"

require('./HealthCareTimeSeries.scss')
const continents = [
  {code: "AS", value: "Asia", color: "#EF4E78"},
  {code: "EU", value: "Europe", color: "#F99072"},
  {code: "AF", value: "Africa", color: "#FFCA81"},
  {code: "NA", value: "North America", color: "#98C55C"},
  {code: "OC", value: "Oceania", color: "#67B279"},
  {code: "SA", value: "South America", color: "#6F87A6"}
]

class HealthCareTimeSeries extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedCountry: {value: "United States", label: "United States"},
      selectedContinent: null
    }
  }

  static PropTypes = {
    label: PropTypes.string,
    data: PropTypes.array,
    renderTooltip: PropTypes.func,
    yAxisFormatting: PropTypes.func
  };

  getClassName() {
    return classNames("HealthCareTimeSeries", this.props.className)
  }

  getData() {
    let {data} = this.props
    let {selectedContinent} = this.state

    return data.map(series => {
      series.filtered = selectedContinent && series.continent != selectedContinent.code
      let continent = filter(continents, c => c.code === series.continent)[0] || {}
      series.color = continent.color
      series.values = filter(series.values, v => !!v.yVal)
      return series
    }).filter(s => !!s.continent)
  }

  getCountries() {
    let {data} = this.props
    return data.map(series => ({
      value: series.country,
      label: series.country
    }))
  }

  onCountrySelect(country) {
    this.setState({selectedCountry: country})
  }

  onContinentSelect(continent) {
    this.setState({selectedContinent: continent})
  }

  onContinentClear() {
    this.setState({selectedContinent: null})
  }

  getSelectedCountry() {
    let {selectedCountry} = this.state
    if (!selectedCountry) return null
    return filter(this.getData(), c => c.country === selectedCountry.value)[0]
  }

  render() {
    let {label} = this.props
    let {selectedCountry, selectedContinent} = this.state

    return (
      <div className={this.getClassName()}>
        <div className="HealthCareTimeSeries__header">
          <h6>{label}</h6>
          <Flex direction="row" className="HealthCareTimeSeries__modulators">
            <Select
              className="HealthCareTimeSeries__modulators__select"
              placeholder="Search for a country"
              value={selectedCountry}
              options={this.getCountries()}
              onChange={::this.onCountrySelect}
            />
            <RadioGroup
              options={continents}
              value={selectedContinent}
              clear
              onSelect={::this.onContinentSelect}
              onClear={::this.onContinentClear}
            />
          </Flex>
        </div>
        <Chart
          selectedSeries={this.getSelectedCountry()}
          data={this.getData()}
          height={500}
          width={window.innerWidth * 0.97}
          valueKeyX="year"
          valueKeyY="yVal"
          xAxisScale={d3.scale.linear}
          xAxisFormatting={d => d}
          yAxisFormatting={this.props.yAxisFormatting}
          renderTooltip={this.props.renderTooltip}
          axesHeights={{
            x: 70,
            y: 100
          }}
          line
          hasTooltip
          brush
        />
      </div>
    )
  }
}

export default HealthCareTimeSeries
