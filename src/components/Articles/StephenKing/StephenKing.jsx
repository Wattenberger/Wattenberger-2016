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
import booksFile from "./books.csv"
import stephenKingBooks from "./kingBooks"
import sortedAuthors from "./sortedAuthors"
console.log(sortedAuthors)
import textInfo from "./textInfo"
const stephenKingBooksEnhanced = _.orderBy(stephenKingBooks, "original_publication_year", "desc")
const flagsToExclude = [
  "Boxset",
  "Box Set",
  "Boxed Set",
  "Movie Companion",
  "Film Diary",
  "Four Great Tragedies:",
  "Complete Works",
  "The Complete Wreck",
  "Complete Collection",
]
console.log(textInfo)

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
d3.csv(booksFile).then(books => {
  const booksByCount = _.countBy(_.flatMap(books, d => d.authors.split(", ")))
  const newSortedAuthors = _.orderBy(_.toPairs(booksByCount), 1, "desc")
  const newSortedAuthorsEnhanced = _.map(newSortedAuthors.slice(100), author => ({
    name: author[0],
    count: author[1],
    books: _.orderBy(_.filter(books, book => _.includes(book.authors, author[0])), d => d.original_publication_year, "desc"),
    annotations: author.name == "Stephen King" ? annotations : [],
  }))
  console.log(newSortedAuthorsEnhanced)
  // setSortedAuthors(newSortedAuthorsEnhanced)
})
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
        </div>

        <div className="StephenKing__books">
        {/* 33, 68, 72, 74, 79 ? */}
          {_.map(sortedAuthors.slice(0, 6), author => (
            <div key={author.name}>
              <StephenKingBooksList
                {...author}
              />
              <StephenKingDots name={author.name} books={author.books} annotations={author.name == "Stephen King" ? annotations : []} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StephenKing


const yearToDate = d => d3.timeParse("%Y")(+d)
const toYear = d3.timeFormat("%-Y")
const StephenKingDots = ({ name, books, annotations }) => {
    const [voronoi, setVoronoi] = useState([]);

    const width = 1300
    const height = 600

    let radiusMetric = "work_ratings_count"
    let colorMetric = "average_rating"
    
    let enhancedBooks = _.filter(books, book => !_.some(
      _.map(flagsToExclude, flag => _.includes(book.title, flag))
    ))

    let radiusScale = d3.scaleSqrt()
      .domain(d3.extent(enhancedBooks.map(d => +d[radiusMetric])))
      .range([6, 70])

    const colorScale = d3.scaleLinear()
        .domain(d3.extent(enhancedBooks.map(d => +d[colorMetric])))
        .range(["#f7d794", "#778beb"]).nice()

    // if (name == "Stephen King") {
    //   enhancedBooks = _.map(enhancedBooks, book => {
    //     const bookWithInfo = textInfo.filter(info => _.includes([
    //       info.book,
    //       bookNameMap[info.book],
    //       `The ${info.book.slice(0, -5)}`,
    //       `A ${info.book.slice(0, -3)}`,
    //     ], book.title))[0]
    //     if (!bookWithInfo) return null
    //     return {
    //       ...bookWithInfo,
    //       percentSwears: _.sum(_.values(bookWithInfo.swear_types)) * 100 / bookWithInfo.number_of_words,
    //       ...book,
    //     }
    //   })
    //   enhancedBooks = _.filter(enhancedBooks)
    //   radiusMetric = "number_of_words"
    //   colorMetric = "percentSwears"
    //   radiusScale.domain(d3.extent(enhancedBooks.map(d => d[radiusMetric])))
    //   colorScale.domain(d3.extent(enhancedBooks.map(d => d[colorMetric])))
    // }

    const xScale = d3.scaleTime()
        .domain(
          d3.extent(enhancedBooks.map(d => yearToDate(d.original_publication_year)))
        //   [
        //   yearToDate(_.last(enhancedBooks).original_publication_year),
        //   yearToDate(_.first(enhancedBooks).original_publication_year),
        // ]
        )
        .range([0, width])
    
    useEffect(function() {
        // const maxViews = _.maxBy(enhancedBooks, metric)[metric]
        var simulation = d3.forceSimulation(enhancedBooks)
            .force("x", d3.forceX(d => xScale(yearToDate(d.original_publication_year))).strength(1))
            //   .force("y", d3.forceY(d => radiusScale))
            .force("y", d3.forceY(height / 2))
            .force("collide", d3.forceCollide(d => radiusScale(+d[radiusMetric]) + 2))
            .stop();

        _.times(200, () => simulation.tick())

        const newVoronoi = d3.voronoi()
            .extent([[0, 0], [width, height]])
            .x(d => d.x)
            .y(d => d.y)
            .polygons(enhancedBooks)
            .filter(d => !!d)
        setVoronoi(newVoronoi)
    }, [])
    
    return (
        <div className="StephenKingDots">
          <h3 className="StephenKingDots__name">{ name }</h3>
          <div className="StephenKingDots__legend">
            <div className="StephenKingDots__legend__item">
              <h6>Average Rating</h6>
              <div className="StephenKingDots__scale">
                { formatNumberWithDecimal(colorScale.domain()[0]) }
                <div className="StephenKingDots__scale__color" style={{
                  background: `linear-gradient(to right, ${colorScale.range()[0]}, ${colorScale.range()[1]})`
                }} />
                { formatNumberWithDecimal(colorScale.domain()[1]) }
              </div>
            </div>

            <div className="StephenKingDots__legend__item">
              <h6>Ratings Count</h6>
              <div className="StephenKingDots__circle-scale">
                {_.map(radiusScale.ticks(3), tick => (
                  <div className="StephenKingDots__circle-scale__item" key={tick} style={{
                    height: radiusScale(tick) * 2 + "px",
                    width: radiusScale(tick) * 2 + "px",
                  }}>
                    <div className="StephenKingDots__circle-scale__item__text">
                      { formatNumber(tick) }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
            {_.map(voronoi, book => {
                if (!book || !book.data) return null;
                // const peakTime = dateAccessor(_.maxBy(book.timeline, viewsAccessor))
                return (
                    <Tooltip
                        key={book.data.id}
                        className="StephenKingDots__item"
                        style={{
                            height: radiusScale(+book.data[radiusMetric]) * 2 + "px",
                            width: radiusScale(+book.data[radiusMetric]) * 2 + "px",
                            transform: `translate(${book.data.x - radiusScale(+book.data[radiusMetric])}px, ${book.data.y - radiusScale(+book.data[radiusMetric])}px)`,
                            background: colorScale(+book.data[colorMetric]),
                        }}
                    >
                      { book.data.title }
                      <div>{ book.data.average_rating }</div>
                      <div>{ +book.data.original_publication_year }</div>
                  </Tooltip>
                )
            })}
            {_.map(_.orderBy(voronoi, d => +d.data[radiusMetric], "desc").slice(0, 6), book => (
              <div key={book.data.id} className="StephenKingDots__item-text" style={{
                transform: `translate(${book.data.x}px, ${book.data.y}px)`,
              }}>{ book.data.title.split(" (")[0].split(":")[0] }</div>
            ))}

            {_.map(annotations, annotation => (
              <div key={annotation.label} className="StephenKingDots__annotation" style={{
                transform: `translate(${xScale(annotation.date)}px)`,                
              }}>
                <div className="StephenKingDots__annotation__label">
                  { annotation.label }
                </div>
              </div>
            ))}

            <div className="StephenKingDots__x-axis">
              {_.map(xScale.ticks(), tick => (
                <div className="StephenKingDots__x-axis__tick" key={toYear(tick)} style={{
                  transform: `translate(${xScale(tick)}px)`,                
                }}>
                  { toYear(tick) }
                </div>
              ))}
            </div>
        </div>
    )
}

const margin = {
  top: 2,
  right: 2,
  bottom: 20,
  left: 20,
}
const StephenKingScatter = ({ metric, height=500, width=500 }) => {
  const yScale = d3.scaleLinear()
      .domain(d3.extent(stephenKingBooksEnhanced.map(d => +d[metric])))
      .range([height - margin.top - margin.bottom, 0])
      .nice()
  const xScale = d3.scaleTime()
      .domain([
        yearToDate(_.last(stephenKingBooksEnhanced).original_publication_year),
        yearToDate(_.first(stephenKingBooksEnhanced).original_publication_year),
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
          data={stephenKingBooksEnhanced}
          radius={6}
          xAccessor={d => xScale(yearToDate(d.original_publication_year))}
          yAccessor={d => yScale(+d[metric])}
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
  const percentSwears = _.sum(_.values(book.swear_types)) / book.number_of_words

  return (
    <div>
        <div>{ book.number_of_words }</div>
        <div>{ formatPercent(percentSwears) } swears</div>
        {_.map(sortedSwears, swear => (
          <div>{ swear[0] }: { swear[1] }</div>
        ))}
        {_.map(sortedSwearTypes, swearType => (
          <div>{ swearType[0] }: { swearType[1] }</div>
        ))}
    </div>
  )
}

const bookNameMap = {
    "11_22_63_ A Novel": "11/22/63",
    // "Face in the Crowd, A",
    "Nightmares & Dreamscapes": "Nightmares and Dreamscapes",
    "Finders Keepers": "Finders Keepers (Bill Hodges Trilogy, #2)",
    // "Big Driver",
    "Black House": "Black House (The Talisman, #2)",
    "Four Past Midnight": "Four Past Midnight ",
    "Colorado Kid, The": "The Colorado Kid (Hard Case Crime #13)",
    // "Good Marriage",
    "Salem's Lot": "'Salem's Lot",
    // "Guns (Kindle Single)",
    "Shining, The": "The Shining (The Shining #1)",
    "Gunslinger, The": "The Gunslinger (The Dark Tower, #1)",
    "Dark Tower IV Wizard and Glass, The": "Wizard and Glass (The Dark Tower, #4)",
    "Dark Tower, The": "The Dark Tower (The Dark Tower, #7)",
    "Hearts In Atlantis": "Hearts in Atlantis",
    "Song of Susannah": "Song of Susannah (The Dark Tower, #6)",
    // "Dark Tower, The",
    "IT": "It",
    "Talisman 01 - The TalismanCL Peter Straub": "The Talisman (The Talisman, #1)",
    "Doctor Sleep": "Doctor Sleep (The Shining, #2)",
    // "Uncollected Stories 2003",
    "Drawing of the Three, The": "The Drawing of the Three (The Dark Tower, #2)",
    "Wind Through the Keyhole, The": "The Wind Through the Keyhole (The Dark Tower, #4.5)",
    "End of Watch (The Bill Hodges Trilogy Book 3)": "End of Watch (Bill Hodges Trilogy, #3)",
    "Mr. Mercedes": "Mr. Mercedes (Bill Hodges Trilogy, #1)",
    "Wolves of the Calla": "Wolves of the Calla (The Dark Tower, #5)",
    "Everything's Eventual": "Everything's Eventual: 14 Dark Tales",
    "Waste Lands, The": "The Waste Lands (The Dark Tower, #3)",
    "Ur": "UR",
    "Green Mile, The": "The Green Mile, Part 1: The Two Dead Girls",
}