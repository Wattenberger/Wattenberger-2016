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
import stephenKingBooks from "./kingBooks"
import textInfo from "./textInfo"


// "Face in the Crowd, A",
// "Big Driver",
// "Good Marriage",
// "Guns (Kindle Single)",
// "Dark Tower, The",
// "Uncollected Stories 2003",
const bookNameMap = { "11_22_63_ A Novel": "11/22/63", "Nightmares & Dreamscapes": "Nightmares and Dreamscapes", "Finders Keepers": "Finders Keepers (Bill Hodges Trilogy, #2)", "Black House": "Black House (The Talisman, #2)", "Four Past Midnight": "Four Past Midnight ", "Colorado Kid, The": "The Colorado Kid (Hard Case Crime #13)", "Salem's Lot": "'Salem's Lot", "Shining, The": "The Shining (The Shining #1)", "Gunslinger, The": "The Gunslinger (The Dark Tower, #1)", "Dark Tower IV Wizard and Glass, The": "Wizard and Glass (The Dark Tower, #4)", "Dark Tower, The": "The Dark Tower (The Dark Tower, #7)", "Hearts In Atlantis": "Hearts in Atlantis", "Song of Susannah": "Song of Susannah (The Dark Tower, #6)", "IT": "It", "Talisman 01 - The TalismanCL Peter Straub": "The Talisman (The Talisman, #1)", "Doctor Sleep": "Doctor Sleep (The Shining, #2)", "Drawing of the Three, The": "The Drawing of the Three (The Dark Tower, #2)", "Wind Through the Keyhole, The": "The Wind Through the Keyhole (The Dark Tower, #4.5)", "End of Watch (The Bill Hodges Trilogy Book 3)": "End of Watch (Bill Hodges Trilogy, #3)", "Mr. Mercedes": "Mr. Mercedes (Bill Hodges Trilogy, #1)", "Wolves of the Calla": "Wolves of the Calla (The Dark Tower, #5)", "Everything's Eventual": "Everything's Eventual: 14 Dark Tales", "Waste Lands, The": "The Waste Lands (The Dark Tower, #3)", "Ur": "UR", "Green Mile, The": "The Green Mile, Part 1: The Two Dead Girls", "On Writing": "On Writing: A Memoir of the Craft" }

const stephenKingBooksEnhanced = _.orderBy(_.map(stephenKingBooks, book => {
  const name = book.title
  const bookInfo = textInfo.filter(info => _.includes([
    info.book,
    bookNameMap[info.book],
    `The ${info.book.slice(0, -5)}`,
    `A ${info.book.slice(0, -3)}`,
  ], name))[0]
  if (!bookInfo) return book

  return {
    ...book,
    ...bookInfo,
    percent_swears: _.sum(_.values(bookInfo.swear_types)) / bookInfo.number_of_words,
  }
}), "original_publication_year", "desc")
console.log(stephenKingBooksEnhanced)

import './StephenKing.scss';

const formatSalary = d => numeral(d).format("$0,0")
const formatNumber = d => numeral(d).format("0,0a")
const formatNumberWithDecimal = d => numeral(d).format("0,0.0a")
const ordinalColors = ["#c7ecee", "#778beb", "#f7d794", "#63cdda", "#cf6a87", "#e77f67", "#786fa6", "#FDA7DF", "#4b7bec", "#778ca3"];
const colorScale = d3.scaleLinear().range(["#c7ecee", "#686de0"]).domain([0, 1])

const annotations = [{
  date: d3.timeParse("%m/%d/%Y")("06/19/1999"),
  label: "Car accident",
},{
  date: d3.timeParse("%m/%d/%Y")("01/01/1982"),
  label: "Intervention",
}]
const StephenKing = () => {
  // const [sortedAuthors, setSortedAuthors] = useState([])
  useEffect(() => {
  })

  return (
    <div className="StephenKing">
      <div className="StephenKing__title-container">
        <h2 className="StephenKing__title">
          Stephen King: the Man, the Myth, the Legend
        </h2>
      </div>
      <div className="StephenKing__contents">

        <div className="StephenKing__scatters">
          <StephenKingScatter metric="work_ratings_count" />
          <StephenKingScatter metric="average_rating" />
          <StephenKingScatter metric="average_sentence_length" />
          <StephenKingScatter metric="average_word_length" />
          <StephenKingScatter metric="percent_swears" />
          <StephenKingScatter metric="sentiment.polarity" />
          <StephenKingScatter metric="sentiment.subjectivity" />
        </div>
      </div>
    </div>
  )
}

export default StephenKing


const yearToDate = d => d3.timeParse("%Y")(+d)
const toYear = d3.timeFormat("%-Y")

const margin = {
  top: 2,
  right: 2,
  bottom: 20,
  left: 20,
}
const StephenKingScatter = ({ metric, height=500, width=500 }) => {
  const data = _.filter(stephenKingBooksEnhanced, d => _.isFinite(_.get(d, metric)))
  if (_.isEmpty(data)) return null

  const yScale = d3.scaleLinear()
      .domain(d3.extent(data.map(d => +_.get(d, metric))))
      .range([height - margin.top - margin.bottom, 0])
      .nice()
  const xScale = d3.scaleTime()
      .domain([
        yearToDate((_.last(data) || {}).original_publication_year),
        yearToDate((_.first(data) || {}).original_publication_year),
      ])
      .range([0, width - margin.left - margin.right])
      .nice()
  return (
    <div className="StephenKingScatter">
      <Chart
        height={height}
        width={width}
        margin={margin}
      >
        <Scatter
          data={data}
          radius={6}
          xAccessor={d => xScale(yearToDate(d.original_publication_year))}
          yAccessor={d => yScale(+_.get(d, metric))}
          dataKey={d => d.id}
        />
        <Axis
          width={width}
          height={height}
          margin={margin}
          scale={xScale}
          dimension="x"
          label="Publication Date"
        />
        <Axis
          width={width}
          height={height}
          margin={margin}
          scale={yScale}
          dimension="y"
          label={metric}
        />
      </Chart>
    </div>
  )
}

const StephenKingBooksList = ({ books, name, count }) => (
  <div className="StephenKingBooksList">
    <h4>{ name } <span className="StephenKingBooksList__count">{ count } books</span></h4>
    <div className="StephenKingBooksList__list">
      {_.map(books, book => (
        <div className="StephenKingBooksList__list__item" key={book.id}>
          <div style={{backgroundImage: `url(${book.image_url})`}} className="StephenKingBooksList__list__item__image" />
          <h5>{ book.title }</h5>
          <div>{ +book.original_publication_year }</div>
          <div>★ { book.average_rating }</div>
          {name == "Stephen King" && (
            <StephenKingBookListInfo name={book.title} />
          )}
        </div>
      ))}
    </div>
  </div>
)

const formatPercent = d3.format(".2%")
const StephenKingBookListInfo = ({ name }) => {
  const book = textInfo.filter(info => _.includes([
    info.book,
    bookNameMap[info.book],
    `The ${info.book.slice(0, -5)}`,
    `A ${info.book.slice(0, -3)}`,
  ], name))[0]
  if (!book) return null

  const sortedSwears = _.orderBy(_.toPairs(book.swear_occurrences), 1, "desc").slice(0, 3)
  const sortedSwearTypes = _.orderBy(_.toPairs(book.swear_types), 1, "desc").slice(0, 3)
  const commonSentences = _.orderBy(_.toPairs(book.common_sentences), 1, "desc").slice(0, 3)
  const percentSwears = _.sum(_.values(book.swear_types)) / book.number_of_words

  return (
    <div>
        <div>{ book.number_of_words }</div>
        <div>{ formatPercent(percentSwears) } swears</div>
        {_.map(sortedSwears, swear => (
          <div>{ swear[0] }: { swear[1] }</div>
        ))}
        {_.map(commonSentences, sentence => (
          <div>{ sentence[0] }: { sentence[1] }</div>
        ))}
        {_.map(sortedSwearTypes, swearType => (
          <div>{ swearType[0] }: { swearType[1] }</div>
        ))}
    </div>
  )
}
