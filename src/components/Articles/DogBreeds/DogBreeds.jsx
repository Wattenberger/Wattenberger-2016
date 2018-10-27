import React, {Component} from "react"
import PropTypes from "prop-types"
import numeral from "numeral"
import ReactSelect from 'react-select';
import Select from 'react-select';
import domToImage from "dom-to-image"
import * as d3 from "d3"
import classNames from "classnames"
import _ from "lodash"
import Tooltip from "components/_ui/Tooltip/Tooltip"
import Button from "components/_ui/Button/Button"
import Chart from 'components/_ui/Chart/Chart';
import { createScale } from 'components/_ui/Chart/utils/scale';
import Line from 'components/_ui/Chart/Line/Line';
import Axis from 'components/_ui/Chart/Axis/Axis';
import data from "./breeds.json"
console.log(data)

import './DogBreeds.scss'

const margin = {
  top: 2,
  right: 0,
  bottom: 30,
  left: 100,
}
const formatXAxis = (d, i) => d + 1926
const formatSalary = d => numeral(d).format("$0,0")
const formatNumber = d => numeral(d).format("0,0")
const ordinalColors = ["#c7ecee", "#778beb", "#f7d794", "#63cdda", "#cf6a87", "#e77f67", "#786fa6", "#FDA7DF", "#4b7bec", "#778ca3"];
const breeds = _.keys(data)
const breedColors = _.fromPairs(
  _.map(breeds, (breed, i) => [
    breed,
    ordinalColors[i % ordinalColors.length],
  ])
)
const breedOptions = _.map(breeds, breed => ({ value: breed, label: breed, color: breedColors[breed] }))
const colorScale = d3.scaleLinear().range(["#c7ecee", "#686de0"]).domain([0, 1])

class DogBreeds extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 0,
      width: 0,
      xScale: null,
      yScale: null,
      tooltipInfo: null,
      closestBreed: null,
      selectedBreeds: [],
      iteration: 0,
    }
  }

  getClassName() {
    return classNames("DogBreeds", this.props.className)
  }

  componentDidMount() {
    this.createScales()
  }

  chart = React.createRef()

  createScales = () => {
    const { selectedBreeds } = this.state

    const height = 500
    const width = window.innerWidth * 0.9
    const xScale = createScale({
      // type: "time",
      width,
      margin,
      dimension: "x",
      domain: [0, data["Akita"].length],
    })
    const selectedBreedValues = _.map(selectedBreeds, "value")
    const filteredValues = _.isEmpty(selectedBreeds) ?
      _.flatMap(data) :
      _.flatMap(data, (values, breed) => _.includes(selectedBreedValues, breed) ? values : [])
    const maxCount = _.max(filteredValues)
    const yScale = createScale({
      height,
      margin,
      dimension: "y",
      domain: [0, maxCount],
    })
    const iteration = this.state.iteration + 1
    this.setState({ height, width, xScale, yScale, iteration })
  }

  xAccessor = (d,i) => this.state.xScale && this.state.xScale(i)
  yAccessor = d => this.state.yScale && this.state.yScale(+d)

  renderTooltip = (hoveredPoint) => (
    <Tooltip className="DogBreeds__tooltip" style={{top: `${hoveredPoint[0]}px`, left: `${hoveredPoint[1]}px`}}>
      hi
    </Tooltip>
  )

  onMouseMove = e => {
    if (!this.chart || !this.chart.current) return
    const { width, xScale, yScale } = this.state

    const mouseX = e.clientX - this.chart.current.getBoundingClientRect().left - margin.left
    const yearIndex = Math.round(xScale.invert(mouseX))
    const year = yearIndex + 1926

    const mouseY = e.clientY - this.chart.current.getBoundingClientRect().top - margin.top
    const mouseYVal = yScale.invert(mouseY)

    const closestBreeds = _.orderBy(_.map(data, (values, breed) => ({
      breed,
      value: +values[yearIndex],
      distanceFromY: Math.abs(mouseYVal - values[yearIndex]),
    })), "distanceFromY", "asc").slice(0, 3)
    const x = xScale(yearIndex)
    const boundedX = Math.max(Math.min(width - 200, x), 0)

    const tooltipInfo = {
      breeds: closestBreeds,
      year,
      y: mouseY,
      x,
      boundedX,
    }

    this.setState({ tooltipInfo, closestBreed: closestBreeds[0].breed })
  }

  clearTooltip = () => {
    this.setState({ tooltipInfo: null, closestBreed: null })
  }

  onBreedsSelect = breeds => {
    this.setState({ selectedBreeds: breeds }, this.createScales)
  }

  render() {
    const { height, width, xScale, yScale, tooltipInfo, closestBreed, selectedBreeds, iteration } = this.state
    const selectedBreedValues = _.map(selectedBreeds, "value")

    return (
      <div className={this.getClassName()}>
        <div className="DogBreeds__title-container">
          <h2 className="DogBreeds__title">
            Dog Breed popularity
          </h2>
        </div>
        <div className="DogBreeds__contents">

          <Select
            isMulti
            name="breeds"
            options={breedOptions}
            value={selectedBreeds}
            className="DogBreeds__select"
            classNamePrefix="DogBreeds__select"
            onChange={this.onBreedsSelect}
          />
          <div className="DogBreeds__chart" ref={this.chart}>
            <Chart
              width={width}
              height={height}
              margin={margin}
              onMouseMove={this.onMouseMove}
              onMouseOut={this.clearTooltip}>
              {!!xScale && _.map(data, (years, breed) => (
                <Line
                  key={breed}
                  data={years}
                  xAccessor={this.xAccessor}
                  yAccessor={this.yAccessor}
                  style={{
                    stroke: breedColors[breed],
                    strokeWidth: closestBreed == breed || _.includes(selectedBreedValues, breed) ? 4 : 1.6,
                    opacity: !selectedBreedValues.length || _.includes(selectedBreedValues, breed) ? 1 : closestBreed == breed ? 0.5 : 0.2,
                  }}
                  iteration={iteration}
                />
              ))}

              <Axis
                dimension="x"
                height={height}
                width={width}
                margin={margin}
                scale={xScale}
                format={formatXAxis}
              />
              <Axis
                dimension="y"
                height={height}
                margin={margin}
                scale={yScale}
                format={formatNumber}
              />

              {tooltipInfo && (
                <rect
                  className="DogBreeds__crosshair"
                  x={tooltipInfo.x}
                  y={margin.top}
                  width={1}
                  height={height - margin.top - margin.bottom}
                />
              )}
            </Chart>

            {tooltipInfo && (
              <DogBreedsTooltip
                style={{transform: `translate3d(${tooltipInfo.boundedX}px, ${tooltipInfo.y}px, 0)`}}
                {...tooltipInfo}
              />
            )}
          </div>
        </div>
    </div>
    )
  }
}

export default DogBreeds


const DogBreedsTooltip = ({ breeds, year, x, boundedX, y, ...props }) => (
  <div className="DogBreedsTooltip" {...props}>
    <h6 className="DogBreedsTooltip__header">{ year }</h6>
    <div className="DogBreedsTooltip__breeds">
      {_.map(breeds, breed => (
        <div className="DogBreedsTooltip__breed" key={breed.breed}>
          <div className="DogBreedsTooltip__breed__label">
            <div className="DogBreedsTooltip__breed-color" style={{background: breedColors[breed.breed]}} />
            { breed.breed }
          </div>
          <div className="DogBreedsTooltip__breed__value">
            { formatNumber(breed.value) }
          </div>
        </div>
      ))}
    </div>
  </div>
)