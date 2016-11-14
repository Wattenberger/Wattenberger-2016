import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import numeral from "numeral"
import _ from "lodash"
import * as d3 from "d3"
import Chart from "components/_ui/Chart/Chart"
import Axis from "components/_ui/Chart/Axis/Axis"
import Scatter from "components/_ui/Chart/Scatter/Scatter"
import Tooltip from "components/_ui/Chart/Tooltip/Tooltip"

require('./ElectionScatter.scss')

const candMap = {
  clintonh: "Hillary Clinton",
  trumpd:   "Donald Trump",
}
const partyMap = {
  "Hillary Clinton": "democrat",
  "Donald Trump": "republican",
}

class ElectionScatter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chart: {},
      scatter: {},
    }
  }

  static PropTypes = {
    data: PropTypes.array,
    xKey: PropTypes.string,
    yKey: PropTypes.string,
    dataKey: PropTypes.string,
  };

  static defaultProps = {
    data: [],
    xKey: "",
    yKey: "",
    dataKey: "",
  };

  getClassName() {
    return classNames("ElectionScatter", this.props.className)
  }

  getData() {
    let {data} = this.props
    return data
  }

  getScales() {
    let {xKey, yKey} = this.props
    let data = this.getData()

    return [
      {
        dimension: "x",
        domain: [0, d3.max(data, d => d[xKey])],
      },
      {
        dimension: "y",
        domain: [0, d3.max(data, d => d[yKey])],
      },
    ]
  }

  getPresCand(d) {
    let winner = d.winner && d.winner.name_display
    let winnerPct = 0
    if (winner) {
      winnerPct = d.winner && d.winner.percent
    } else {
      _.keys(d["Vote Share Counted"]).forEach(key => {
        let amount = d["Vote Share Counted"][key] * 100
        if (amount > winnerPct) {
          winnerPct = amount
          let winner = key
        }
        winner = candMap[key]
      })
    }

    return {winner, winnerPct}
  }

  renderTooltip = (d) => {
    let {xKey, yKey, dataKey} = this.props
    let {winner, winnerPct} = this.getPresCand(d)

    return <div>
      <h6>{d[dataKey]}</h6>
      <div><b>{xKey}</b>: {d3.format(",")(d[xKey])}</div>
      <div><b>{yKey}</b>: {d3.format(",")(d[yKey])}</div>
      {yKey == "Precincts Total" && <div><b>People per Precinct</b>: {d3.format(",.1f")(d["Voting-Eligible Population (VEP)"] / d["Precincts Total"])}</div>}
      <div><b>Winner</b>: {winner} ({d3.format(".1f")(winnerPct)}%)</div>
    </div>
  }

  componentDidMount() {
    this.setState({chart: this.chart})
    this.setState({scatter: this.scatter})
  }

  onDotsUpdate = (dots) => {
    dots.attr("fill", d => {
      let {winner, winnerPct} = this.getPresCand(d)
      let party = d.winner ?
                    d.winner.party_id :
                    partyMap[this.getPresCand(d).winner]
      return party == "democrat"   ? `rgba(  0, 83, 151, ${winnerPct}` :
             party == "republican" ? `rgba(225, 51,  52, ${winnerPct}` :
            null
    })
  }

  render() {
    let {chart, scatter} = this.state
    let {xKey, yKey, dataKey} = this.props

    return (
      <div className={this.getClassName()}>
        <Chart
          data={this.getData()}
          height={500}
          width={window.innerWidth < 700 ?
            window.innerWidth * 0.95 :
            800
          }
          margin={{top: 10, right: 10, bottom: 30, left: 60}}
          scales={this.getScales()}
          ref={Chart => this.chart = Chart}
        >
          <Axis
            chart={chart}
            scale="x"
            dimension="x"
            format={d => d3.format(".2s")(d)}
            label={xKey}
          />
          <Axis
            chart={chart}
            scale="y"
            dimension="y"
            format={d => d3.format(".2s")(d)}
            label={yKey}
          />
          <Scatter
            chart={chart}
            data={this.getData()}
            xAccessor={d => chart.state && chart.state.scales.x(d[xKey])}
            yAccessor={d => chart.state && chart.state.scales.y(d[yKey])}
            dataKey={d => d[dataKey]}
            ref={Scatter => this.scatter = Scatter}
            onUpdate={this.onDotsUpdate}
          />
          <Tooltip
            type="scatter"
            elem={scatter}
            renderElem={this.renderTooltip}
            xAccessor={d => chart.state && chart.state.scales.x(d[xKey])}
            yAccessor={d => chart.state && chart.state.scales.y(d[yKey])}
          />
        </Chart>
      </div>
    )
  }
}

export default ElectionScatter
