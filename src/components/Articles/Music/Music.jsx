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
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import emotion from "./emotion"
console.log(emotion)

import './Music.scss';

const emoji = {
  DISGUSTED: "🤢",
  SURPRISED: "😮",
  ANGRY: "😡",
  HAPPY: "😀", //🙂
  CALM: "😐",
  SAD: "😰",
  CONFUSED: "😕",
}

const formatNumber = d => numeral(d).format("0,0a")
const formatNumberWithDecimal = d => numeral(d).format("0,0.0a")
const ordinalColors = ["#c7ecee", "#778beb", "#f7d794", "#63cdda", "#cf6a87", "#e77f67", "#786fa6", "#FDA7DF", "#4b7bec", "#778ca3"];
const colorScale = d3.scaleLinear().range(["#c7ecee", "#686de0"]).domain([0, 1])
const Music = () => {

  return (
    <div className="Music">
      <h2 className="Music__title">
        Classical Music
      </h2>
      <div className="Music__contents">

        <MusicStaff />
      </div>
    </div>
  )
}

export default Music

const getTopExpression = expressions => (_.first(_.filter(
  _.orderBy(
    expressions, "Confidence", "desc"
  ),
  d => d.Confidence > 0.5
)) || {}).Type
const timeAccessor = d => d.time
const expressionAccessor = d => d.expression
const headPitchAccessor = d => d.headPitch
const MusicStaff = () => {
  const emotions = _.filter(emotion.map(d => ({
    time: d.Timestamp,
    expression: getTopExpression(d.Face.Emotions),
    headPitch: d.Face.Pose.Pitch,
  })), expressionAccessor)
  const xScale = d3.scaleLinear()
    .domain(d3.extent(emotions, timeAccessor))
    .range([0, 100])
  const yScale = d3.scaleQuantize()
    .domain(d3.extent(emotions, headPitchAccessor))
    .range(_.map(_.times(9), (d, i) => (i * 100) / 8))
    // .range([0, 100])

  return (
    <div className="MusicStaff">
      <div className="MusicStaff__clef">
        {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="feather feather-play-circle"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg> */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="feather feather-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
      </div>
      <div className="MusicStaff__notes">
        {_.map(emotions, (d, i) => {
          const isFirst = !emotions[i - 1] || emotions[i - 1].expression != d.expression
          return (
            <div
              key={timeAccessor(d)}
              className="MusicStaff__note"
              style={{
                left: `${xScale(timeAccessor(d))}%`,
                top: `${yScale(headPitchAccessor(d))}%`,
                // opacity: isFirst ? 1 : 0.1,
                zIndex: isFirst ? 2 : 1,
              }}>
              { isFirst ? emoji[expressionAccessor(d)] : "·" }
            </div>
          )
        })}
      </div>

      {_.map(_.times(5), (d, i) => (
        <div
          key={i}
          className="MusicStaff__line"
          style={{
            top: `${i * 100 / 4}%`
          }}
        />
      ))}
    </div>
  )
}