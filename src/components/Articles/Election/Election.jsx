import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import _ from "lodash"
import numeral from "numeral"
import Select from "react-select"
import "react-select/dist/react-select.css"
import Flex from "components/_ui/Flex/Flex"
import Scatter from "./ElectionScatter/ElectionScatter"
import Map from "./ElectionMap/ElectionMap"
import {states} from "./data"
import {counties} from "./counties"
import {countyUnemploymentRates} from "./county_unemployment_rates"

console.log("states:",states);
console.log("counties:",counties);
console.log("countyUnemploymentRates:",countyUnemploymentRates);

const parameters = [
  "VEP Total Ballots Counted",
  "Total Ballots Counted (Estimate)",
  "Voting-Eligible Population (VEP)",
  "Voting-Age Population (VAP)",
  "% Non-citizen",
  "Prison",
  "Probation",
  "Parole",
  "Total Ineligible Felon",
  "2015 Q2 GOP",
  "Precincts Reporting",
  "Precincts Total",
  "Percent Counted",
].map(p => ({slug: p, label: p}))
const mapParameters = [
  {
    slug: "democratic_vote_share",
    label: "Democratic Vote Share",
    colors: [
      "rgb(200,200,200)",
      "rgb(  0, 83,151)",
    ]
  },
  {
    slug: "voters_per_sq_mi",
    label: "Voters per Square Mile",
    colors: [
      "rgb(200,200,200)",
      "rgb( 79, 58, 75)",
    ],
    maxVal: 400
  },
]

require('./Election.scss')

class Election extends Component {
  constructor(props) {
    super(props)
    this.state = {
      xKey: "Parole",
      yKey: "Prison",
      mapParams: mapParameters[0],
    }
  }

  getClassName() {
    return classNames("Election", this.props.className)
  }

  onKeySelect(axis, newVal) {
    this.setState({[`${axis}Key`]: newVal.slug})
  }

  onMapKeySelect(newVal) {
    this.setState({mapParams: newVal})
  }

  render() {
    let {xKey, yKey, mapParams} = this.state

    return (
      <div className={this.getClassName()}>
        <Flex direction="row" className="Election__modulators">
          <Select
            className="Election__modulators__select"
            value={mapParams}
            options={mapParameters}
            onChange={::this.onMapKeySelect}
            clearableValue={false}
          />
          </Flex>
        <Map
          data={counties}
          colorKey={mapParams.slug}
          colors={mapParams.colors}
          keyLabel={mapParams.label}
          maxVal={mapParams.maxVal}
        />

        <Flex direction="row" className="Election__modulators">
          {["x", "y"].map(axis =>
            <Select
              key={axis}
              className="Election__modulators__select"
              placeholder={axis}
              value={{slug: this.state[`${axis}Key`], label: this.state[`${axis}Key`]}}
              options={parameters}
              onChange={this.onKeySelect.bind(this, axis)}
              clearableValue={false}
            />
          )}
        </Flex>
        <Scatter
          data={states.filter(state => state.State != "United States")}
          xKey={xKey}
          yKey={yKey}
          dataKey="State"
        />
      </div>
    )
  }
}

export default Election
