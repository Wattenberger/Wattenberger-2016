import React, {Component} from "react"
import {Route} from 'react-router-dom'
import classNames from "classnames"
import rssParser from "rss-parser";
import _ from "lodash";
import * as d3 from "d3";
import Sentiment from "sentiment"
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

import ButtonGroup from 'components/_ui/Button/ButtonGroup/ButtonGroup';
import Button from 'components/_ui/Button/Button';

import { getFromStorage, setInStorage } from 'utils/utils';

const parser = new rssParser({
  // headers: {
  //   "Accept": "text/html,application/xhtml+xml,application/xml"
  // }
})
const sentiment = new Sentiment();

const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"

require('styles/app.scss')
require('./News.scss')
const sites = [
  {label: "The Atlantic", url: "https://www.theatlantic.com/feed/all/"},
  {label: "ABC", url: "http://feeds.abcnews.com/abcnews/topstories"},
  {label: "CBS", url: "https://www.cbsnews.com/latest/rss/main"},
  {label: "NBC", url: "https://www.nbcnewyork.com/news/top-stories/?rss=y"},
  {label: "BBC", url: "http://feeds.bbci.co.uk/news/rss.xml"},
  // {label: "NPR", url: "https://www.npr.org/sections/news/"},
  // {label: "NPR", url: "http://feeds.feedburner.com/blogspot/lQlzL"},
  {label: "Reuters", url: "http://feeds.reuters.com/reuters/topNews/?format=xml"},
  {label: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml"},
  // {label: "The Hill", url: "https://thehill.com/rss/syndicator/19109"},
  // {label: "The Hill International", url: "https://thehill.com/taxonomy/term/43/feed"},
  {label: "PBS Now", url: "http://www.pbs.org/now/rss.xml"},
  {label: "PBS Nova", url: "http://www.pbs.org/wgbh/nova/rss/nova.xml"},
]

const today = new Date()
const formatDate = date => {
  const daysAgo = Math.round((today - date) / (1000 * 60 * 60 * 24));
  const hoursAgo = Math.round((today - date) / (1000 * 60 * 60));
  const minutesAgo = Math.round((today - date) / (1000 * 60));
  return minutesAgo < 10  ? ""                   :
         hoursAgo   <  1  ? `${minutesAgo}m`     :
         hoursAgo   < 24  ? `${hoursAgo}h`       :
         daysAgo    <  1  ? `${hoursAgo}h`       :
        //  daysAgo <  2  ? `${daysAgo} day ago` :
         daysAgo    < 30  ? `${daysAgo}d`        :
                           d3.timeFormat("%-m/%-d/%Y")(date)
}
const defaultSiteOptions = _.map(sites, site => ({
  label: site.label,
  active: true,
}))
const defaultActiveSites = _.map(_.filter(defaultSiteOptions, "active"), "label")
const defaultSentimentRange = [-100, 100]
const localStorageActiveSitesKey = "news--active-sites"
const localStorageSentimentRangeKey = "news--sentiment-range"
const localStorageLastLoadKey = "news--last-load"
const storageTimeFormat = "%H:%M %m/%d/%Y"
const parseTime = d3.timeParse(storageTimeFormat)
const formatTime = d3.timeFormat(storageTimeFormat)
const fetchInterval = 1000 * 60 * 5
class News extends Component {
  constructor(props) {
    super(props)
    this.state = {
      articles: [],
      siteOptions: defaultSiteOptions,
      activeSites: defaultActiveSites,
      sentimentRange: defaultSentimentRange,
      isDimmingSeen: true,
      isLoading: true,
      isShowingAbout: false,
    }
    this.getNews = this.getNews.bind(this)
  }
  isFirstLoad = true

  componentDidMount() {
    this.setDefaults();
    this.getNews();
  }

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout)
  }

  getClassName() {
    return classNames("News")
  }

  setDefaults = () => {
    const activeSites = getFromStorage(localStorageActiveSitesKey) || defaultActiveSites
    const sentimentRange = getFromStorage(localStorageSentimentRangeKey) || defaultSentimentRange
    const siteOptions = _.map(sites, site => ({
      label: site.label,
      active: _.includes(activeSites, site.label),
    }))
    this.setState({ activeSites, siteOptions, sentimentRange })
  }

  getNews = () => {
    Promise.all(sites.map(site => this.getFeed(site.url))).then(feeds => {
      const lastLoad = getFromStorage(localStorageLastLoadKey)
      // const lastLoad = "17:25 09/30/2018"
      const parsedLastLoad = lastLoad ? parseTime(lastLoad) : null

      const articles = _.orderBy(
        _.filter(
          _.flatMap(feeds, (feed, index) => _.map(feed.items || [], item => ({
            ...item,
            site: sites[index].label,
            pubDate: new Date(item.pubDate),
            hasBeenViewed: parsedLastLoad ? new Date(item.pubDate) < parsedLastLoad : false,
            sentiment: sentiment.analyze([item.title, item.contentSnippet].join(". ")),
          }))),
          article => !!article && !_.startsWith(article.title, "WATCH: ")
        ),
        "pubDate",
        "desc"
      )
      this.setState({ articles, isLoading: false })

      if (this.isFirstLoad) {
        const currentTime = formatTime(new Date())
        setInStorage(localStorageLastLoadKey, currentTime)
      }
      this.isFirstLoad = false;
      this.timeout = setTimeout(this.getNews, fetchInterval)
    })
  }

  getFeed = async site => {
    try {
      return await parser.parseURL(`${CORS_PROXY}${site}`)
    } catch(e) {
      return []
    }
  }

  onSiteChange = toggledSite => {
    const isSelectingOne = this.state.activeSites.length == sites.length;
    const isSelectingAll = this.state.activeSites.length == 1 && _.includes(this.state.activeSites, toggledSite.label);
    const siteOptions = _.map(this.state.siteOptions, site => ({
      ...site,
      active: isSelectingAll ? true :
        isSelectingOne ?
          site.label == toggledSite.label ? true : false :
          site.label == toggledSite.label ? !site.active : site.active,
    }))
    const activeSites = _.map(_.filter(siteOptions, "active"), "label")
    setInStorage(localStorageActiveSitesKey, activeSites)
    this.setState({ siteOptions, activeSites })
  }

  onSentimentRangeChange = newRange => {
    const sentimentRange = _.sortBy(newRange)
    this.setState({ sentimentRange })
    setInStorage(localStorageSentimentRangeKey, sentimentRange)
  }
  onIsDimmingSeenToggle = e => {
    e.stopPropagation();
    e.preventDefault();
    const isDimmingSeen = !this.state.isDimmingSeen
    this.setState({ isDimmingSeen })
    // setInStorage(localStorageIsDimmingSeenKey, isDimmingSeen)
  }

  onIsShowingAboutToggle = () => {
    const isShowingAbout = !this.state.isShowingAbout
    this.setState({ isShowingAbout })
    // setInStorage(localStorageIsDimmingSeenKey, isDimmingSeen)
  }

  render() {
    const { articles, siteOptions, activeSites, sentimentRange, isDimmingSeen, isLoading, isShowingAbout } = this.state
    const filteredArticles = _.filter(articles, article => (
      _.includes(activeSites, article.site) &&
      (!article.sentiment || article.sentiment.score > sentimentRange[0]) &&
      (!article.sentiment || article.sentiment.score < sentimentRange[1])
    ))
    const groupedArticles = _.groupBy(filteredArticles, "hasBeenViewed")
    const seenArticles = groupedArticles.true || []
    const unseenArticles = groupedArticles.false || []

    return (
      <div className={this.getClassName()}>
        {/* {isShowingAbout && (
          <p>
            stuffs
          </p>
        )} */}
        <div className="News__controls">
          <ButtonGroup
            className="News__toggle"
            buttons={siteOptions}
            onChange={this.onSiteChange}
          />
          {/* <div className="News__controls__about-toggle" onClick={this.onIsShowingAboutToggle}>
            About
          </div> */}
          <div className="News__slider">
            <div className="News__slider__values">
              <div className="News__slider__value">
                Sentiment:
              </div>
              <div className="News__slider__value">
                {sentimentRange.join(" to ")}
              </div>
            </div>
            <Range
              value={sentimentRange}
              min={-100}
              max={100}
              count={2}
              onChange={this.onSentimentRangeChange}
              pushable
              allowCross={false}
            />
          </div>
        </div>
        <div className={`News__articles News__articles--is-${isDimmingSeen ? "dimming-seen" : "not-dimming-seen"}`}>
          {isLoading && (
            <div className="News__note">Loading...</div>
          )}
          {unseenArticles.map(article => <NewsArticle key={article.guid} article={article} />)}
          {!!seenArticles.length && (
            <div className="News__articles-separator">
              <div className="News__articles-separator__text">
                Already seen
              </div>
              <div className="News__articles-separator__line" />

              <Button className="News__articles-separator__toggle" onClick={this.onIsDimmingSeenToggle}>
                { isDimmingSeen ? "Don't" : "Do" } dim
              </Button>
            </div>
          )}
          {seenArticles.map(article => <NewsArticle key={article.guid} article={article} />)}
        </div>
      </div>
    )
  }
}

export default News

const NewsArticle = ({ article }) => (
  <a className={[
    "NewsArticle",
    `NewsArticle--is-${article.hasBeenViewed ? "not-new" : "new"}`,
  ].join(" ")} href={article.link} target="_blank">
    <div className="NewsArticle__title">
      <div className="NewsArticle__title__label">
        { article.title }
      </div>
      <div className="NewsArticle__site">
        { article.site }
      </div>
      <div className="NewsArticle__date">
        { formatDate(article.pubDate) }
      </div>
    </div>
    <div className="NewsArticle__snippet">
      { article.contentSnippet.slice(0, 200) }
    </div>
    <div className="NewsArticle__sentiment">
      Sentiment: { article.sentiment && article.sentiment.score }
    </div>
  </a>
)