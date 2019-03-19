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
console.log(emotion[0])

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
const emotions = _.filter(emotion.map(d => ({
  time: d.Timestamp,
  expression: getTopExpression(d.Face.Emotions),
  headPitch: d.Face.Pose.Pitch,
})), expressionAccessor)

const eyesClosed = _.filter(emotion.map(d => ({
  eyesAreClosed: d.Face.EyesOpen && !d.Face.EyesOpen.Value && d.Face.EyesOpen.Confidence > 0.9,
  time: d.Timestamp,
})), "eyesAreClosed")

const getLandmark = (d, landmark) => _.first(_.filter(d.Face.Landmarks, d => d.Type == landmark)) || {}
const getEyebrowDistance = d => getLandmark(d, "leftEyeBrowLeft").Y - getLandmark(d, "eyeLeft").Y
const eyebrowMean = d3.mean(emotion.map(getEyebrowDistance))
const eyebrowStandardDeviation = d3.deviation(emotion.map(getEyebrowDistance))
const eyebrowRaises = _.filter(emotion.map(d => (
  getEyebrowDistance(d) > (eyebrowMean + eyebrowStandardDeviation) ? d.Timestamp : null
)))
console.log(eyebrowRaises)

const MusicStaff = () => {
  const xScale = d3.scaleLinear()
    .domain(d3.extent(emotions, timeAccessor))
    .range([0, 100])
  const yScale = d3.scaleQuantize()
    .domain(d3.extent(emotions, headPitchAccessor))
    .range(_.map(_.times(9), (d, i) => (i * 100) / 8))
    // .range([0, 100])

  return (
    <div className="MusicStaff__wrapper">
      <div className="MusicStaff">
        <div className="MusicStaff__key">
          <div className="MusicStaff__key__item">
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"> <circle cx="17" cy="17" r="16" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <circle cx="21" cy="7" r="1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <circle cx="13" cy="7" r="1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <path d="M25 10C25 13.866 21.4183 17 17 17C12.5817 17 9 13.866 9 10" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </svg>
          </div>
          <div className="MusicStaff__key__item">
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"> <circle cx="17" cy="17" r="16" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <circle cx="21" cy="19" r="1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <circle cx="13" cy="19" r="1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <path d="M25 22C25 25.866 21.4183 29 17 29C12.5817 29 9 25.866 9 22" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </svg>
          </div>
        </div>
        <div className="MusicStaff__clef">
          {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="feather feather-play-circle"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg> */}
          {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="feather feather-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> */}
          <svg x="0px" y="0px" width="100" height="125" viewBox="0 0 100 125" enableBackground="new 0 0 100 100"><g><path d="M62.933,74.837c-1.004-1.86-0.253-3.151-0.212-3.219c0.179-0.285,0.157-0.652-0.054-0.916   c-0.213-0.266-0.573-0.365-0.893-0.248c-0.012,0.004-1.192,0.428-2.156-0.066c-0.564-0.289-0.974-0.862-1.218-1.704   c-0.531-3.447-0.437-5.812,0.271-6.84c0.394-0.573,1.135-0.501,1.859-0.379c0.085,0.014,0.16,0.027,0.225,0.036   c0.305,0.041,0.612-0.1,0.778-0.359c0.277-0.434,0.026-0.828-0.057-0.957c-0.166-0.261-0.608-0.954-0.448-2.028   c0.071-0.478,0.166-0.689,0.309-1.01c0.271-0.606,0.608-1.359,0.869-3.829c0.302-2.857-0.344-5.239-1.919-7.077   c-2.276-2.656-5.827-3.388-7.321-3.583l-0.422-20.371h1.066c0.011,0.025,0.022,0.051,0.034,0.076   c0.209,0.407,0.604,0.64,1.084,0.64c0.831,0,1.508-0.676,1.508-1.508c0-0.831-0.676-1.508-1.508-1.508   c-0.481,0-0.876,0.233-1.084,0.64c-0.013,0.025-0.023,0.05-0.034,0.076H52.51l-0.052-2.507h1.071   c0.011,0.025,0.022,0.051,0.034,0.076c0.209,0.407,0.604,0.64,1.084,0.64c0.831,0,1.508-0.676,1.508-1.508   c0-0.831-0.676-1.508-1.508-1.508c-0.481,0-0.876,0.233-1.084,0.64c-0.013,0.025-0.023,0.05-0.034,0.076h-1.104l-0.024-1.15   c0.621-0.423,1.311-1.206,1.311-2.353c0-1.153-0.878-1.386-1.253-1.485c-0.224-0.059-0.321-0.091-0.382-0.164   c-0.062-0.074-0.206-0.329-0.206-1.084c0-1.148-0.267-1.948-0.793-2.383l0.005-0.008c-0.013-0.009-0.041-0.026-0.079-0.048   c-0.057-0.042-0.117-0.081-0.18-0.115C50.544,7.67,50.26,7.624,50,7.635c-0.26-0.01-0.544,0.035-0.825,0.186   c-0.063,0.034-0.122,0.074-0.18,0.116c-0.039,0.022-0.066,0.04-0.079,0.048c-0.119,0.078-0.21,0.183-0.27,0.301   c-0.344,0.465-0.518,1.163-0.518,2.09c0,0.756-0.144,1.01-0.206,1.084c-0.061,0.073-0.158,0.104-0.382,0.164   c-0.375,0.1-1.253,0.333-1.253,1.485c0,1.147,0.689,1.93,1.311,2.353l-0.053,2.582h-1.119c-0.011-0.025-0.022-0.051-0.034-0.076   c-0.209-0.407-0.604-0.64-1.084-0.64c-0.831,0-1.508,0.676-1.508,1.508c0,0.831,0.676,1.508,1.508,1.508   c0.481,0,0.876-0.233,1.084-0.64c0.013-0.025,0.023-0.05,0.034-0.076h1.086l-0.052,2.507h-1.114   c-0.011-0.025-0.021-0.051-0.034-0.075c-0.209-0.407-0.604-0.64-1.084-0.64c-0.831,0-1.508,0.676-1.508,1.507   c0,0.831,0.676,1.508,1.508,1.508c0.481,0,0.876-0.233,1.084-0.64c0.013-0.025,0.023-0.05,0.034-0.076h1.081l-0.392,18.939   c-1.494,0.195-5.046,0.927-7.321,3.583c-1.575,1.839-2.221,4.22-1.919,7.077c0.261,2.47,0.598,3.223,0.869,3.829   c0.143,0.32,0.238,0.532,0.309,1.01c0.16,1.074-0.282,1.767-0.448,2.028c-0.083,0.129-0.334,0.524-0.057,0.957   c0.166,0.26,0.473,0.401,0.779,0.359c0.064-0.009,0.139-0.021,0.224-0.036c0.724-0.122,1.464-0.193,1.859,0.379   c0.708,1.028,0.801,3.393,0.271,6.84c-0.244,0.842-0.653,1.415-1.218,1.704c-0.964,0.494-2.144,0.071-2.152,0.068   c-0.319-0.121-0.681-0.023-0.896,0.243c-0.215,0.266-0.235,0.639-0.05,0.927c0.008,0.013,0.797,1.333-0.217,3.211   c-0.679,1.258-2.805,7.376,0.046,12.155c2.128,3.567,6.401,5.375,12.699,5.375c0.065,0,0.127-0.009,0.187-0.023   c0.06,0.015,0.123,0.023,0.187,0.023c6.298,0,10.571-1.808,12.699-5.375C65.738,82.213,63.612,76.095,62.933,74.837z    M50.482,62.707h-0.964h-1.314l0.767-37.054h2.058l0.767,37.054H50.482z M47.947,13.154c0.917-0.244,1.765-0.749,1.765-2.778   c0-0.732,0.125-1.022,0.186-1.12c0.034-0.013,0.07-0.024,0.102-0.031c0.031,0.007,0.066,0.017,0.101,0.031   c0.061,0.098,0.187,0.387,0.187,1.12c0,2.03,0.848,2.535,1.765,2.778c0.023,0.006,0.049,0.013,0.074,0.02   c-0.043,0.741-0.808,1.09-0.835,1.102c-0.299,0.126-0.49,0.422-0.483,0.746l0.133,6.416c-0.001,0.019-0.003,0.038-0.003,0.057   c0,0.032,0.002,0.063,0.006,0.093l0.051,2.48h-1.992l0.187-9.047c0.007-0.324-0.185-0.62-0.483-0.746   c-0.008-0.003-0.791-0.355-0.835-1.102C47.898,13.167,47.924,13.16,47.947,13.154z M49.276,83.092   c-0.383-0.626-0.64-2.221-0.702-4.273c0.195,0.019,0.399,0.027,0.606,0.027c0.272,0,0.549-0.015,0.82-0.037   c0.271,0.022,0.548,0.037,0.82,0.037c0.216,0,0.428-0.009,0.629-0.029c0,2.228-0.189,3.666-0.561,4.275   c-0.269,0.44-0.628,1.41-0.646,4.741c-0.007,1.226,0.036,2.357,0.063,2.949c-0.039,0-0.078,0.001-0.117,0.001   c-0.065,0-0.127,0.009-0.187,0.023c-0.06-0.015-0.123-0.023-0.187-0.023c-0.036,0-0.071-0.001-0.106-0.001   c0.043-0.598,0.112-1.718,0.134-2.931C49.9,84.512,49.547,83.536,49.276,83.092z M61.527,86.18c-1.635,2.74-4.875,4.268-9.64,4.553   c-0.143-2.843-0.054-6.15,0.353-6.815c0.397-0.65,0.845-1.892,0.789-5.767c-0.002-0.129-0.004-0.235-0.004-0.312   c0-0.036-0.003-0.07-0.008-0.105c0.002-0.02,0.005-0.04,0.007-0.06c0.024-0.437-0.31-0.81-0.747-0.834   c-0.297-0.015-0.565,0.133-0.714,0.368c-0.158,0.033-0.42,0.049-0.728,0.048c-0.135-0.067-0.29-0.097-0.451-0.077   c-0.126,0.016-0.255,0.029-0.384,0.04c-0.129-0.011-0.258-0.024-0.384-0.04c-0.16-0.02-0.315,0.01-0.45,0.077   c-0.308,0.001-0.57-0.015-0.729-0.048c-0.148-0.235-0.416-0.384-0.714-0.368c-0.437,0.024-0.771,0.398-0.747,0.834   c0.001,0.02,0.004,0.04,0.007,0.06c-0.005,0.034-0.008,0.069-0.008,0.105c0,2.065,0.165,4.796,0.949,6.079   c0.404,0.661,0.416,3.973,0.199,6.816c-4.771-0.284-8.014-1.812-9.65-4.554c-1.261-2.114-1.321-4.578-1.15-6.273   c0.202-1.997,0.791-3.677,1.137-4.319c0.73-1.353,0.786-2.53,0.651-3.383c0.593,0.023,1.299-0.057,1.976-0.399   c0.992-0.502,1.682-1.423,2.05-2.739c0.008-0.03,0.015-0.061,0.02-0.092c0.628-4.046,0.461-6.598-0.524-8.028   c-0.604-0.878-1.464-1.12-2.211-1.147c0.173-0.603,0.212-1.23,0.116-1.875c-0.103-0.693-0.269-1.064-0.43-1.424   c-0.225-0.503-0.505-1.129-0.739-3.348c-0.254-2.404,0.265-4.38,1.541-5.874c1.8-2.108,4.695-2.796,6.092-3.013l-0.398,19.217   c-0.004,0.213,0.077,0.418,0.226,0.57s0.353,0.238,0.566,0.238h2.122h0.964h2.122c0.213,0,0.417-0.086,0.566-0.238   c0.149-0.152,0.23-0.358,0.226-0.57l-0.398-19.219c1.393,0.213,4.277,0.896,6.086,3.007c1.281,1.495,1.801,3.474,1.547,5.881   c-0.234,2.219-0.514,2.845-0.739,3.348c-0.161,0.359-0.327,0.731-0.43,1.424c-0.096,0.646-0.057,1.273,0.116,1.875   c-0.746,0.027-1.607,0.27-2.211,1.147c-0.985,1.431-1.152,3.982-0.524,8.028c0.005,0.031,0.011,0.062,0.02,0.092   c0.368,1.316,1.058,2.238,2.05,2.739c0.677,0.342,1.383,0.422,1.976,0.399c-0.135,0.853-0.079,2.031,0.652,3.383   c0.346,0.642,0.935,2.322,1.137,4.319C62.848,81.602,62.788,84.066,61.527,86.18z"/><path d="M53.418,70.17c0.003-0.127,0.01-0.424-0.235-0.679c-0.247-0.257-0.543-0.261-0.703-0.264   c-0.737-0.011-1.284-0.023-1.691-0.034c-0.14-0.059-0.297-0.078-0.452-0.049c-0.033,0.003-0.123,0.011-0.337,0.021   c-0.214-0.01-0.304-0.018-0.337-0.021c-0.156-0.029-0.313-0.01-0.453,0.049c-0.406,0.011-0.953,0.023-1.69,0.034   c-0.159,0.002-0.455,0.007-0.702,0.264c-0.245,0.255-0.238,0.552-0.235,0.679c0.002,0.094,0.006,0.268-0.109,0.673   c-0.107,0.374-0.036,0.75,0.2,1.058c0.365,0.478,1.084,0.747,2.331,0.874c0.084,0.009,0.167,0.016,0.248,0.023   c0.08,0.029,0.165,0.045,0.255,0.047c0.006,0,0.037,0.001,0.089,0.001c0.085,0,0.227-0.001,0.404-0.006   c0.178,0.005,0.319,0.006,0.404,0.006c0.052,0,0.083,0,0.089-0.001c0.09-0.001,0.175-0.018,0.255-0.047   c0.081-0.007,0.164-0.014,0.248-0.023c1.247-0.127,1.966-0.396,2.331-0.874c0.236-0.308,0.306-0.683,0.199-1.058   C53.411,70.438,53.415,70.263,53.418,70.17z M50.003,71.256c-0.791-0.024-1.57-0.13-1.933-0.263   c0.016-0.068,0.029-0.131,0.04-0.191c0.922-0.016,1.509-0.033,1.891-0.051c0.381,0.018,0.968,0.035,1.891,0.051   c0.011,0.06,0.024,0.123,0.04,0.191C51.568,71.125,50.793,71.231,50.003,71.256z"/></g></svg>
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
                {_.includes(eyebrowRaises, timeAccessor(d)) && (
                  <div style={{top: isFirst ? "-0.6em" : 0}} className="MusicStaff__note__eyebrow">⌒</div>
                )}
              </div>
            )
          })}
        </div>

        {_.map(eyesClosed, (d, i) => (
          <div
            key={i}
            className="MusicStaff__eye"
            style={{
              left: `${xScale(timeAccessor(d))}%`
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye-off"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
          </div>
        ))}

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
    </div>
  )
}