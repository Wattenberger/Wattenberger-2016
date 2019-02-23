import { useState, usePrevious, useEffect } from 'react';
import React, {Component} from "react"
import PropTypes from "prop-types"
import numeral from "numeral"
import domToImage from "dom-to-image"
import * as d3 from "d3"
import classNames from "classnames"
import _ from "lodash"
import Tooltip from "components/_ui/Tooltip/Tooltip"
import Button from "components/_ui/Button/Button"
import RadioGroup from "components/_ui/RadioGroup/RadioGroup"
import Chart from "components/_ui/Chart/Chart"
import { createScale } from 'components/_ui/Chart/utils/scale';
import Line from 'components/_ui/Chart/Line/Line';
import Scatter from "components/_ui/Chart/Scatter/Scatter"
import Axis from "components/_ui/Chart/Axis/Axis"
import Gradient from "components/_ui/Chart/Gradient/Gradient"
import data from "./data"
import countryCodes from "./countryCodes"
console.log(data)

import './Fishing.scss';

const formatSalary = d => numeral(d).format("$0,0")
const formatNumber = d => numeral(d).format("0,0a")
const formatNumberWithDecimal = d => numeral(d).format("0,0.0a")
const ordinalColors = ["#c7ecee", "#778beb", "#f7d794", "#63cdda", "#cf6a87", "#e77f67", "#786fa6", "#FDA7DF", "#4b7bec", "#778ca3"];
const countryColors = _.fromPairs(_.map(_.keys(countryCodes), (country, i) => [
  country,
  ordinalColors[i % (ordinalColors.length - 1)],
]))
const colorScale = d3.scaleLinear().range(["#c7ecee", "#686de0"]).domain([0, 1])

const metricOptions = [{
  value: "boats",
  label: "Daily number of boats fishing in foreign waters",
},{
  value: "hours",
  label: "Daily hours of fishing in foreign waters",
}]
const metricFieldMap = {
  boats: "hours_by_day",
  hours: "boats_by_day",
}
const metricTakenFieldMap = {
  boats: "taken_hours",
  hours: "taken_boats",
}
const metricLabels = _.fromPairs(_.map(metricOptions, metric => ([
  metric.value,
  metric.label,
])))
console.log(metricLabels )
const Fishing = () => {
  // const [sortedAuthors, setSortedAuthors] = useState([])
  const [metric, setMetric] = useState("boats")
  const setMetricToValue = d => setMetric(d.value)
  useEffect(() => {
  })

  return (
    <div className="Fishing">
      <div className="Fishing__title-container">
        <h2 className="Fishing__title">
          Global Fishing
        </h2>
      </div>
      <div className="Fishing__contents">
        {/* <div className="Fishing__timelines">
          <FishingTimeline data={data[0]} />
          <FishingTimeline data={data[1]} />
        </div> */}

        <RadioGroup
          options={metricOptions}
          value={metric}
          onChange={setMetricToValue}
        />

        
        <div className="Fishing__circles">
          {_.map(data, d => d.name && (
            <div className="Fishing__circles__item">
              <h6>{ countryCodes[d.name] || d.name }</h6>
              <div className="Fishing__circles__item__description">
                { metricLabels[metric] } (2016)
              </div>
              <FishingCircle
                data={d}
                metric={metricFieldMap[metric]}
                takenMetric={metricTakenFieldMap[metric]}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="Fishing__note">
        Data from <a href="https://www.olgatsubiks.com/single-post/2019/02/07/Visualizing-global-fishing-to-promote-ocean-sustainability">Global Fishing Watch</a> which uses AIS tracking devices and other kinds of information to show what's happening in the oceans around the world. They monitor commercial fishing activity and larger boats.
      </div>
    </div>
  )
}

export default Fishing


const parseDate = d3.timeParse("%m/%d/%Y")
const parseMonth = d3.timeParse("%m")
const formatMonth = d3.timeFormat("%b")
const FishingCircle = ({ data, metric, takenMetric }) => {
  if (!data) return null

  const width = 400
  const height = 400
  const margin = {top: 50, right: 50, bottom: 50, left: 50}
  const boundedWidth = width - margin.left - margin.right
  const boundedHeight = height - margin.top - margin.bottom
  const radius = boundedWidth / 2
  const gradientId = `gradient-${_.uniqueId()}`

  const dateAccessor = d => d.date
  const radiusAccessor = d => d.count
  const colorScale = d3.interpolateLab("cornflowerblue", "tomato")
  
  const [countryData, setCountryData] = useState([])
  const [takenData, setTakenData] = useState([])
  // const [lineGenerator, setLineGenerator] = useState(_.noop)
  // const [radiusScale, setRadiusScale] = useState(_.noop)
  // const [dateScale, setDateScale] = useState(_.noop)

  useEffect(() => {
    const newCountryData = _.map(data[metric], (values, toCountry) => ({
      name: toCountry,
      values: _.sortBy(_.map(values, (count, date) => ({
          date: parseDate(date),
          count,
        })), "date"),
    }))
    setCountryData(newCountryData)

    const newTakenData = _.sortBy(_.map(data[takenMetric], (count, date) => ({
      date: parseDate(date),
      count,
    })), "date")
    setTakenData(newTakenData)

  }, [metric])  

  const dateScale = d3.scaleTime()
    // .domain(d3.extent(_.flatMap(countryData, "values"), dateAccessor))
    .domain([parseDate("01/01/2015"), parseDate("01/01/2016")])
    .range([0, Math.PI * 2])
  
  const radiusScale = d3.scaleLinear()
    .domain(d3.extent(_.flatMap(countryData, "values"), radiusAccessor))
    .range([0, radius])
    .nice()

  const dateAccessorScaled = d => dateScale(dateAccessor(d)) || 0
  const radiusAccessorScaled = d => radiusScale(radiusAccessor(d)) || 0
  const takenRadiusAccessorScaled = d => radius * 0.99 - (radiusScale(radiusAccessor(d)) || 0)
  
  const lineGenerator = d3.lineRadial()
    .angle(dateAccessorScaled)
    .radius(radiusAccessorScaled)
    .curve(d3.curveLinearClosed)
  
  const takenAreaGenerator = d3.lineRadial()
    .angle(dateAccessorScaled)
    .radius(takenRadiusAccessorScaled)
    .curve(d3.curveLinearClosed)

  return (
    <div className="FishingCircle__wrapper">
      <div className="FishingCircle__annotation">
        Fish taken from { countryCodes[data.name] }’s waters
      </div>

      <svg
        className={`FishingCircle`}
        width={width}
        height={height}>
        {/* <defs>
          <Gradient
            id={gradientId}
            x={-width / 7}
            y={-height / 4}
            width={-width / 7}
            height={height / 2}
            stops={_.times(10, i => ({
              offset: `${i * 100 / 9}%`,
              color: colorScale(i / 9),
            }))}
          />
        </defs> */}
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          <circle
            r={radius}
            className="FishingCircle__taken"
          >
            <title>
              Taken from { countryCodes[data.name] }’s waters
            </title>
          </circle>
          <path
            d={takenAreaGenerator(takenData)}
            className="FishingCircle__reset"
          />
        
          {radiusScale && _.map(radiusScale.ticks(3), yValue => {
            // const yValue = radiusScale && radiusScale.domain()[1] * (i + 1) / 3
            if (!yValue) return null
            const r = radiusScale(yValue)
            return (
              <circle key={yValue}
                className="FishingCircle__tick"
                r={r}
              />
            )
          })}
          
          {/* <rect
            x={-25}
            y={-radius}
            width={50}
            height={radius * 0.9}
            className="FishingCircle__tick-rect"
          /> */}
          {radiusScale && _.map(radiusScale.ticks(3), yValue => {
            // const yValue = radiusScale && radiusScale.domain()[1] * (i + 1) / 3
            if (!yValue) return null
            const r = radiusScale(yValue)
            return (
              <text transform={`translate(0, ${-r + 6})`} className="FishingCircle__tick-text" key={yValue}>
                { radiusScale && formatNumber(yValue) }
              </text>
            )
          })}
          {_.map(countryData, (toCountry, i) => (
            <path
              key={toCountry.name}
              className="FishingCircle__country"
              d={lineGenerator(toCountry.values)}
              // fill={`url(#${gradientId})`}
              fill={countryColors[toCountry.name]}
            >
              <title>
                { countryCodes[toCountry.name] }
              </title>
            </path>
          ))}
          {_.times(12, i => {
            const angle = i * ((Math.PI * 2) / 12) - Math.PI * 0.5
            const x = Math.cos(angle) * (radius * 1.1)
            const y = Math.sin(angle) * (radius * 1.1)
            return (
              <text
                key={i}
                className="FishingCircle__month"
                transform={`translate(${x},${y})`}
                style={{textAnchor: i == 0 || i == 6 ? "middle" :
                                                  i < 6 ? "start"  :
                                                          "end"
              }}>
                { formatMonth(parseMonth(i)) }
              </text>
            )
          })}
        </g>

        <line
          className="FishingCircle__annotation-line"
          x1={width - 86}
          x2={width - 86 + 35}
          y1={height - 103}
          y2={height - 103 + 35}
        />
      </svg>
    </div>
  )
}