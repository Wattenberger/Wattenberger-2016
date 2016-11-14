import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import numeral from "numeral"
import _ from "lodash"
import * as d3 from "d3"
import Chart from "components/_ui/Chart/Chart"
import Map from "components/_ui/Chart/Map/Map"
import Tooltip from "components/_ui/Chart/Tooltip/Tooltip"
import {us_counties_map as countyMap} from "components/_ui/Chart/Map/us_counties"

require('./ElectionMap.scss')

class ElectionMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chart: {},
      map: {},
    }
  }

  static PropTypes = {
    data: PropTypes.array,
    xKey: PropTypes.string,
    yKey: PropTypes.string,
    colors: PropTypes.array,
    keyLabel: PropTypes.array,
    maxVal: PropTypes.number,
  };

  static defaultProps = {
    data: [],
    xKey: "",
    yKey: "",
  };

  getClassName() {
    return classNames("ElectionMap", this.props.className)
  }

  getData() {
    let {data} = this.props
    return data
  }

  getScales() {
    let {data, colorKey, colors, maxVal} = this.props

    return [
      {
        id: "color",
        type: "linear",
        domain: [0, maxVal || d3.max(_.keys(data), key => data[key][colorKey])],
        range: colors
      }
    ]
  }

  renderTooltip = (d) => {
    let {data, colorKey, keyLabel} = this.props
    let state = data[+d.id]

    return state && <div>
      <h6>{state.cty_name, state.statenam}</h6>
      <div><b>{keyLabel}</b>: {d3.format(",.2f")(state[colorKey])}</div>
    </div>
  }

  componentDidMount() {
    this.setState({chart: this.chart})
    this.setState({map: this.map})
  }

  render() {
    let {chart, map} = this.state
    let {data, colorKey} = this.props

    return (
      <div className={this.getClassName()}>
        <Chart
          data={this.getData()}
          height={650}
          width={950}
          margin={{top: 0, right: 0, bottom: 0, left: 0}}
          scales={this.getScales()}
          ref={Chart => this.chart = Chart}
        >
          <Map
            mapJson={countyMap}
            chart={chart}
            data={this.getData()}
            colorAccessor={
              d => chart.state && chart.state.scales && chart.state.scales.color && data[+d.id] ?
                chart.state.scales.color(data[+d.id][colorKey]) :
                "#fff"
            }
            ref={Map => this.map = Map}
          />
          <Tooltip
            type="map"
            elem={map}
            renderElem={this.renderTooltip}
            xAccessor={d => d.geometry.coordinates[0][0][0]}
            yAccessor={d => d.geometry.coordinates[0][0][1]}
          />
        </Chart>
      </div>
    )
  }
}

export default ElectionMap
