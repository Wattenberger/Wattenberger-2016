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
import Chart from "components/_ui/Chart/Chart"
import Scatter from "components/_ui/Chart/Scatter/Scatter"
import Axis from "components/_ui/Chart/Axis/Axis"
import dataFile from "./data.csv"

import './DVS.scss';

const formatNumber = d => numeral(d).format("0,0a")
const formatNumberWithDecimal = d => numeral(d).format("0,0.0a")
const ordinalColors = ["#c7ecee", "#778beb", "#f7d794", "#63cdda", "#cf6a87", "#e77f67", "#786fa6", "#FDA7DF", "#4b7bec", "#778ca3"];
const colorScale = d3.scaleLinear().range(["#c7ecee", "#686de0"]).domain([0, 1])

const DVS = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    d3.csv(dataFile).then(rows => {
      setData(rows)
    })
  }, [])

  return (
    <div className="DVS">
      <div className="DVS__title-container">
        <h2 className="DVS__title">
          Data Visualization Society
        </h2>
      </div>
      <div className="DVS__contents">
        {!!data.length && <DVSMap data={data} />}
      </div>
    </div>
  )
}

export default DVS


const axes = [
  "society",
  "visualization",
  "data",
]
const colorAxisScale = d3.scaleLinear()
  .domain([0, 5])
  .range([0, 1])
const colors = [
  d3.interpolateRainbow(0.43),
  d3.interpolateRainbow(0.76),
  d3.interpolateRainbow(0.1),
]
const colorAxisScales = colors.map(color => (
  d3.interpolateHsl("#aaa", color)
))
const locations = [{
  name: "NYC",
  location: [40.7128, -74.0060],
},{
  name: "LA",
  location: [34.0522, -118.2437],
},{
  name: "Philadelphia",
  location: [39.9526, -75.1652],
// },{
//   name: "Rochester",
//   location: [43.1566, -77.6088],
},{
  name: "Lima",
  location: [-12.0464, -77.0428],
},{
  name: "Berlin",
  location: [52.5200, 13.4050],
},{
  name: "Tokyo",
  location: [35.6895, 139.6917],
}]
const grabColor = (values) => {
  const colors = values.map((d, i) => ({
    color: d3.hsl(d3.color(colorAxisScales[i](d))),
    value: d,
  }))
  const mainColor = _.maxBy(colors, "value").color
  let combinedColor = d3.lab("gray")
  combinedColor.l = d3.mean(colors, d => d.l)
  combinedColor.a = d3.mean(colors, d => d.a)
  combinedColor.b = d3.mean(colors, d => d.b)
  return mainColor.toString()
}
const DVSMap = ({ data=[] }) => {
  const [location, setLocation] = useState([0, 0])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setLocation([
        position.coords.latitude,
        position.coords.longitude,
      ])
    })
  }, [])

  const dateAccessor = d => d3.timeParse("%m/%d/%Y")(d.date)
  const dateScale = d3.scaleLog()
    .domain(d3.extent(data, dateAccessor))
    .range([0, 300])
  const relativeLocations = _.map(data, d => ({
      ...d,
      distance: [
        location[0] - +d.lat,
        +d.long - location[1],
      ],
      angle: findAngle(location[1], location[0], d.long, d.lat),
      newLocation: findNewPoint(
        0,
        0,
        findAngle(location[1], location[0], d.long, d.lat),
        // 60 + dateScale(dateAccessor(d)),
        60 + Math.log10(findDistance(location[1], location[0], d.long, d.lat)) * 100,
      ),
      color: grabColor(_.map(axes, axis => colorAxisScale(+d[axis] || 0))),
  }))


    // var simulation = d3.forceSimulation(relativeLocations)
    //     .force("x", d3.forceX(d => d.newLocation[0]).strength(1))
    //     //   .force("y", d3.forceY(d => radiusScale))
    //     .force("y", d3.forceX(d => d.newLocation[1]).strength(1))
    //     .force("collide", d3.forceCollide(2))
    //     .stop();

    // _.times(50, () => simulation.tick())

    // const voronoi = d3.voronoi()
    //     .extent([[-400, -400], [400, 400]])
    //     .x(d => d.x)
    //     .y(d => d.y)
    //     .polygons(relativeLocations)
    //     .filter(d => !!d)
// console.log(voronoi)
  // const angles = _.range(0, 2 * Math.PI, 2 * Math.PI / 30)
  // const angleData = _.map(angles, (angle, i) => {
  //   const dataPoints = _.filter(relativeLocations, d => d.angle > angle && d.angle < (angles[i + 1] || Math.PI * 2))
  //   const sums = _.map(axes, (axis, i) => _.sumBy(dataPoints, d => +d[axis]) || 0)
  //   return {
  //     angle,
  //     sums,
  //   }
  // })

  // const radiusScale = d3.scaleLinear()
  //   .domain([0, d3.max(_.flatMap(angleData, "sums"))])
  //   .range([100, 250])
  //   .nice()

  // const lineGenerator = d3.lineRadial()
  //   .angle((d, i) => angles[i])
  //   .radius(radiusScale)
  //   .curve(d3.curveLinearClosed)

  // const xScale = d3.scaleLinear()
  //   .domain([
  //     d3.min(relativeLocations, d => d.distance[1]),
  //     0,
  //     d3.max(relativeLocations, d => d.distance[1]),
  //   ])
  //   .range([-400, 0, 400])
  // const yScale = d3.scaleLinear()
  //   .domain([
  //     d3.min(relativeLocations, d => d.distance[0]),
  //     0,
  //     d3.max(relativeLocations, d => d.distance[0]),
  //   ])
  //   .range([-200, 0, 200])

    const onMouseOver = d => () => {
      console.log(d)
    }

  return (
    <div className="DVSMap">
      <div className="DVSMap__center">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
      </div>
      {_.map(locations, (d, i) => {
        const newLocation = findNewPoint(
          0,
          0,
          findAngle(location[1], location[0], d.location[1], d.location[0]),
          // 60 + dateScale(dateAccessor(d)),
          60 + Math.log10(findDistance(location[1], location[0], d.location[1], d.location[0])) * 100,
        )
        console.log(newLocation)
        return (
          <div
            className="DVSMap__location"
            key={d.name}
            style={{
              transform: `translate(${newLocation[0]}px, ${newLocation[1] * -1}px)`,
            }}
            onMouseOver={onMouseOver(d)}
          >
          { d.name }
          </div>
        )
      })}
      {/* <svg height={900} width={900}>
        <g style={{
          transform: `translate(450px, 450px)`
        }}>
          {_.map(axes, (d, i) => (
            <path
              className="DVSMap__fill"
              key={i}
              style={{
                fill: colors[i],
              }}
              d={lineGenerator(angleData.map(d => d.sums[i]))}
              onMouseOver={onMouseOver(d)}
            />
          ))}
        </g>
      </svg> */}
      {_.map(relativeLocations, (d, i) => (
        <div
          className="DVSMap__dot"
          key={i}
          style={{
            background: d.color,
            // transform: `translate(${d3.min([xScale(d.distance[1]), d.newLocation[0]])}px, ${d3.min([yScale(d.distance[0]), d.newLocation[1]])}px)`,
            transform: `translate(${d.newLocation[0]}px, ${d.newLocation[1] * -1}px)`,
            // transform: `translate(${d.data.x}px, ${d.data.y}px)`,
          }}
          onMouseOver={onMouseOver(d)}
        />
      ))}
    </div>
  )
}

const findAngle = (x1, y1, x2, y2) => (
  Math.atan2(y2 - y1, x2 - x1)
)
const findDistance = (x1, y1, x2, y2) => (
  Math.sqrt(Math.pow(x2 - x1, 2) + (Math.pow(y2 - y1, 2)))
)

const findNewPoint = (x, y, angle, distance) => [
  Math.round(Math.cos(angle) * distance + x),
  Math.round(Math.sin(angle) * distance + y),
]