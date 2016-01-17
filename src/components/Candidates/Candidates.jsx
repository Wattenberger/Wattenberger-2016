import React, {Component} from "react"
import classNames from "classnames"
import _ from "lodash"
import numeral from "numeral"
import sentiment from "sentiment"
import {candidates} from "./data"
import Chart from "components/_ui/Chart/Chart"
import d3 from "d3"
import Sidebar from "components/Sidebar/Sidebar"

require('./Candidates.scss')

class Candidates extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedBar: undefined
    }
  }

  getClassName() {
    return classNames("Candidates")
  }

  getMetaTags() {
    let tags = _.countBy(_.flatten(_.flatten(_.map(candidates, _.values)).map(s => _.keys(s))))
    return _.keys(tags).map(key =>
      ({
        name: key,
        count: +tags[key]
      })
    )
  }

  getCandidates() {
    return _.keys(candidates)
  }

  getArticleScore(article) {
    let text = [
      article.title || article["twitter:title"] || "",
      article.description || article['twitter:description']
    ].join(" ")
    let score = sentiment(text)
    return score
  }

  getArticlesWithScore(candidate, targetScore) {
    let scores = this.getCandidateScores(candidate)
    return scores.filter(score => score.score === targetScore)

  }

  getCandidateScores(candidate) {
    return candidates[candidate].map(article => _.merge({}, article, this.getArticleScore(article)))
  }

  getCandidateScoresForHistogram(candidate) {
    let scores = _.countBy(this.getCandidateScores(candidate).map(d => d.score))
    let points = _.keys(scores).map(key => ({
      score: +key,
      count: scores[key]
    }))
    points = _.sortBy(points, 'score')
    return points
  }

  renderMetaTags() {
    return this.getMetaTags().map((tag, idx) =>
      <div key={tag.count + " " + idx}><b>{tag.name}</b>: {tag.count}</div>
    )
  }

  renderTooltip(candidate, point) {
    let articlesList = this.getArticlesWithScore(candidate, point.xValue)
    return <div>
      <h3>{candidate} articles with a score of {point.xValue}</h3>
      <div>Count: {point.yValue}</div>
      <ul>
        {articlesList.slice(0,4).map(article =>
          <li>{article.title}</li>
        )}
      </ul>
    </div>
  }

  onBarClick(candidate, point) {
    this.setState({selectedBar: {candidate, point}})
  }

  renderSidebar() {
    let {selectedBar} = this.state
    let articlesList = this.getArticlesWithScore(selectedBar.candidate, selectedBar.point.xVal)

    return <div>
      <h2>{selectedBar.candidate} articles with a score of {selectedBar.point.xVal}</h2>
      <div>Count: {selectedBar.point.yVal}</div>
      <h3>Articles</h3>
      <ul>
        {articlesList.slice(0,4).map(article =>
          <li>
            <h3>{article.title || article["twitter:title"]}</h3>
            <div>{article.description || article["twitter:description"]}</div>
          </li>
        )}
      </ul>
    </div>
  }

  render() {
    let {selectedBar} = this.state
    return (
      <div className={this.getClassName()}>
        {this.getCandidates().map(candidate =>
          <div>
            <div key={candidate}>
              <b>{candidate}</b>: {numeral(_.sum(this.getCandidateScores(candidate).map(d => d.score)) / this.getCandidateScores(candidate).length).format("0.00")}
            </div>
            <Chart
              data={this.getCandidateScoresForHistogram(candidate)}
              width={window.innerWidth * 0.7}
              valueKeyX="score"
              valueKeyY="count"
              xAxisLabel="Score"
              yAxisLabel="Count"
              xAxisScale={d3.scale.linear}
              xDomain={[-20,20]}
              bar
              onBarClick={this.onBarClick.bind(this, candidate)}
            />
          </div>
        )}
        {!!selectedBar &&
          <Sidebar>{this.renderSidebar()}</Sidebar>
        }
      </div>
    )
  }
}

export default Candidates
