import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import numeral from "numeral"
import moment from "moment"
import * as d3 from "d3"
import {data} from "./data"
import Chart from "components/_ui/Chart/Chart"
import Axis from "components/_ui/Chart/Axis/Axis"
import Scatter from "components/_ui/Chart/Scatter/Scatter"
import Tooltip from "components/_ui/Chart/Tooltip/Tooltip"

require('./PresidentialAppointments.scss')

// Example dp
  // "year": 2017,
  // "date": "01/23/2017",
  // "role": "Director of the Central Intelligence Agency",
  // "name": "Mike Pompeo",
  // "vote": 66,
  // "voteType": "roll call"

const dataDateFormat = "MM/DD/YYYY"
const dateFormat = "MMM DD, YYYY"
const xKey = "date"
const yKey = "vote Pts"

class PresidentialAppointments extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chart: {},
      scatter: {},
    }
  }

  getClassName() {
    return classNames("PresidentialAppointments", this.props.className)
  }

  getScales = () => [
    {
      dimension: "x",
      domain: [moment(data[0][xKey], dataDateFormat), moment(data[data.length - 1][xKey], dataDateFormat)],
      type: "scaleTime",
    },
    {
      dimension: "y",
      domain: [0, d3.max(data, d => d[yKey])],
    },
  ]

  componentDidMount() {
    this.setState({chart: this.chart})
  }

  renderTooltip = (d) => {
    let {xKey, yKey, dataKey} = this.props

    return <div>
      <h6>{moment(d.Date, dataDateFormat).format(dateFormat)}</h6>
      // <div><b>{xKey}</b>: {d3.format(",")(d[xKey])}</div>
      <div><b>{yKey}</b>: {d3.format(",")(d[yKey])}</div>
      <div><b>Winner</b>: {d.Winner}</div>
    </div>
  }


  render() {
  	let {chart, scatter} = this.state

    return (
      <div className={this.getClassName()}>
      	<h1>Presidential Appointments</h1>
      	<Chart
      	  data={data}
      	  height={400}
          width={window.innerWidth < 700 ?
            window.innerWidth * 0.95 :
            800
          }
          margin={{top: 10, right: 10, bottom: 30, left: 60}}
      	  scales={this.getScales()}
          ref={Chart => this.chart = Chart}
        >
          <Axis
            chart={this.chart}
            scale="x"
            dimension="x"
            label={xKey}
          />
          <Axis
            chart={this.chart}
            scale="y"
            dimension="y"
            format={d => d3.format(".2s")(d)}
            label={yKey}
          />
          <Scatter
            chart={this.chart}
            data={data}
            xAccessor={d => chart && chart.state && chart.state.scales.x(moment(d[xKey], dataDateFormat))}
            yAccessor={d => chart && chart.state && chart.state.scales.y(d[yKey])}
            ref={Scatter => this.scatter = Scatter}
          />
          <Tooltip
            type="scatter"
            elem={scatter}
            renderElem={this.renderTooltip}
            xAccessor={d => chart && chart.state && chart.state.scales.x(moment(d[xKey], dataDateFormat))}
            yAccessor={d => chart && chart.state && chart.state.scales.y(d[yKey])}
          />
  	    </Chart>
      </div>
    )
  }
}

export default PresidentialAppointments
