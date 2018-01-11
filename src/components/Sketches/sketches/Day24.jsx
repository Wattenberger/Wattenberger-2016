import React, {Component} from "react"
import classNames from "classnames"
import _ from "lodash"
import * as d3 from "d3"

import Gradient from "components/_ui/Chart/Gradient/Gradient"

require('./Day24.scss')

const SVG_HEIGHT = 400
const HOUSE_DIMENSION = 200
const HOUSE_BUFFER = 20
const ORIFICE_WIDTH = HOUSE_DIMENSION * 0.2
const ORIFICE_BUFFER = HOUSE_DIMENSION * 0.05
const TOTAL_HOUSE_DIMENSION = HOUSE_DIMENSION + HOUSE_BUFFER
const STORY_HEIGHT = HOUSE_DIMENSION / 3
const orificeTypes = ["window"]
const houseColors = [ "#ddd", "navajowhite", "#FF7C59", "#D56649", "#AA5039", "#7F3B29", "#27556C", "#3E82A3", "#326B87", "#867376", "#DFBFC4", "#AF9397", "#7C776F", "#CECAC2", "#A39E96", "#7D8583", "#616967", "#7C746F", "#CEC7C2", "#A39B96", "#83858A", "#65686D", "#2F3136"]
const roofColors = ["#53261A", "#1D3F50", "#122935", "#5A5152", "#211F1F", "#504C45", "#312C22", "#47504E", "#2C3432", "#16201D", "#504945", "#312822", "#4B4D53", "#181A21", "charcoal", "#003423", "#026243", "#4E1A00", "#943403", "#480011", "#880322", "#113C4F", "#455311", "#563612", "#7D4D16",]

const getHouseDimWithinRange = (min=0, max=1) => TOTAL_HOUSE_DIMENSION * _.random(min, max, true)

class Day24 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: SVG_HEIGHT,
      width: window.innerWidth,
      svg: null,
      interval: null,
      houses: [],
      iterations: 0,
      numHouses: 0,
    }
  }

  componentDidMount() {
    let svg = this.svg
    const { elem } = this.refs
    const width = elem.offsetWidth
    const numHouses = Math.floor(width / TOTAL_HOUSE_DIMENSION) - 1
    this.setState({ svg, width, numHouses })

    this.createHouse()
    const interval = window.setInterval(this.createHouse, 2000)
    this.setState({ interval })
  }

  componentWillUnmount() {
    const { interval } = this.state
    if (interval) window.clearInterval(interval)
  }

  createHouse = () => {
    let { width, houses, iterations, numHouses } = this.state

    iterations++

    let newHouses = [...houses, this.getHouse({
      x: (houses.length + 0.5) * TOTAL_HOUSE_DIMENSION,
      y: (SVG_HEIGHT - TOTAL_HOUSE_DIMENSION) / 2,
    })]
    newHouses = _.map(newHouses, (house, i) => i > newHouses.length - numHouses ? house : null)

    this.setState({ houses: newHouses, iterations })
  }

  getHouse = (pos) => {
    const mainColor = _.sample(houseColors)
    const roofColor = _.sample(roofColors)
    const width = getHouseDimWithinRange(0.6)
    const stories = _.random(1, 2)
    const additionWidth = !_.random(0, 4) ? _.random(HOUSE_DIMENSION * 0.2, width * 0.8, true) : 0
    const additionStories = additionWidth ? _.random(1, stories) : stories
    const additionXOffset = _.random(-(width - additionWidth) / 2, (width - additionWidth) / 2)
    const chimneyWidth = !_.random(0, 6) ? _.random(HOUSE_DIMENSION * 0.05, width * 0.2, true) : 0

    return (
      <g
        className="house"
        key={`${pos.x},${pos.y}`}>
        <g
          style={{
            transform: [
              `translate3d(${pos.x}px, ${pos.y}px, 0)`,
              // `rotate(${_.random(-30, 30, true)}deg)`,
              // `scale3d(${_.random(0.8, 1.2, true)}, ${_.random(0.8, 1.2, true)}, 1)`,
            ].join(" ")
          }}>
          {chimneyWidth && this.getChimney(
            chimneyWidth,
            stories,
            (HOUSE_DIMENSION - width) / 2 + getHouseDimWithinRange(0, width)
          )}
          {this.getStructure(width, stories, roofColor, mainColor)}
          {_.times(additionStories, story => {
            const numOrifices = Math.floor(width / (ORIFICE_WIDTH + ORIFICE_BUFFER))
            const doorIndex = !story ? _.random(0, numOrifices) : -1

            return _.times(numOrifices, i => (
              <g key={i} style={{
                transform: [
                  "translate3d(",
                  [
                    _.round(((width - numOrifices * (ORIFICE_WIDTH + ORIFICE_BUFFER) + ORIFICE_BUFFER + ORIFICE_BUFFER) / 2) + i * (ORIFICE_WIDTH + ORIFICE_BUFFER), 0),
                    _.round(HOUSE_DIMENSION - (STORY_HEIGHT * (story + 1)), 0),
                    0
                  ].join("px, "),
                  ")"
                ].join("")
              }}>
                {this.getOrifice(i == doorIndex && "door")}
              </g>
            ))
          })}
          {!!additionWidth && this.getStructure(
            additionWidth,
            additionStories,
            roofColor,
            d3.color(mainColor).brighter(_.random(0.3, 1.2)),
            additionXOffset
          )}
          {additionWidth && _.times(additionStories, story => {
            const numOrifices = Math.floor(width / (ORIFICE_WIDTH + ORIFICE_BUFFER))
            const doorIndex = !story ? _.random(0, numOrifices) : -1

            return _.times(numOrifices, i => (
              <g key={i} style={{
                transform: [
                  "translate3d(",
                  [
                    _.round((HOUSE_DIMENSION - width) / 2 + additionXOffset + ((additionWidth + ORIFICE_WIDTH) / 2), 0),
                    _.round(HOUSE_DIMENSION - (STORY_HEIGHT * (story + 1)), 0),
                    0
                  ].join("px, "),
                  ")"
                ].join("")
              }}>
                {this.getOrifice()}
              </g>
            ))
          })}
        </g>
      </g>
    )
  }

  getChimney = (chimneyWidth, stories, x) => {
    const height = STORY_HEIGHT * (stories + _.random(0.1, 1))

    return (
      <rect
        className="house__chimney"
        height={height}
        width={chimneyWidth}
        x={x}
        y={HOUSE_DIMENSION - height}
        fill="black"
      />
    )
  }

  getStructure = (width, stories, roofColor, mainColor, xOffset=0) => (
    <g>
      <rect
        height={stories * STORY_HEIGHT + 1}
        width={width}
        x={(HOUSE_DIMENSION - width) / 2 + xOffset}
        y={HOUSE_DIMENSION - (STORY_HEIGHT * stories) - 1}
        fill={mainColor}
      />
      {this.getRoof(width, stories, roofColor, mainColor, xOffset)}
    </g>
  )

  getRoof = (width, stories, roofColor, mainColor, xOffset=0) => {
    const bottomOfRoof = HOUSE_DIMENSION - stories * STORY_HEIGHT
    const overhang = getHouseDimWithinRange(0.01, 0.07)
    let paths = [
      [(HOUSE_DIMENSION - width) / 2 - overhang + xOffset, bottomOfRoof               ].join(" "),
      [HOUSE_DIMENSION           / 2            + xOffset, bottomOfRoof - STORY_HEIGHT].join(" "),
      [(HOUSE_DIMENSION + width) / 2 + overhang + xOffset, bottomOfRoof               ].join(" "),
    ].join("L ")

    return (
      <path
        className="house__roof"
        d={"M " + paths}
        stroke={roofColor}
        fill={mainColor}
      />
    )
  }

  getOrifice = type => {
    type = type || _.random(0, 5) && _.sample(orificeTypes)
    if (!type) return null
    const range = type == "door" ? [0.7, 0.9] : [0.3, 0.6]
    const height = STORY_HEIGHT * _.random(range[0], range[1], true)
    const width = ORIFICE_WIDTH * _.random(0.7, 1, true)

    return (
      <rect
        className={`house__orifice house__orifice--${type}`}
        height={height}
        width={width}
        x={(ORIFICE_WIDTH - width) / 2}
        y={type == "door" ? STORY_HEIGHT - height : (STORY_HEIGHT - height) / 2}
        fill={type == "door" ? _.sample(houseColors) : "white"}
      />
    )
  }



  getClassName() {
    return classNames("Day24")
  }

  render() {
    let { height, width, houses, iterations, numHouses } = this.state

    return (
      <div className={this.getClassName()} ref="elem">
        <svg
          height={height}
          width={width}
          ref={svg => this.svg = svg}
        >
          <rect
            className="Day24__background"
            height={height}
            width={width}
          />
          <g className="houses" style={{
            transform: `translate3d(-${(iterations - numHouses) * TOTAL_HOUSE_DIMENSION}px, 0, 0)`
          }}>
            {houses}
          </g>
        </svg>
      </div>
    )
  }
}

export default Day24
