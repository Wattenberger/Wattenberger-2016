import React, {Component} from "react"
import {Route} from 'react-router-dom'
import classNames from "classnames"
import rssParser from "rss-parser";
import _ from "lodash";
import * as d3 from "d3";
import ButtonGroup from 'components/_ui/Button/ButtonGroup/ButtonGroup';
import { getFromStorage, setInStorage } from 'utils/utils';
const parser = new rssParser({
  headers: {
    // "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
    // "User-Agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36"
    // "Content-Type": "application/xml"
    "Accept": "text/html,application/xhtml+xml,application/xml"
  }
})
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
  // {label: "Reuters", url: "http://feeds.reuters.com/reuters/topNews/"},
]

const today = new Date()
const formatDate = date => {
  const daysAgo = Math.round((today - date) / (1000 * 60 * 60 * 24));
  const hoursAgo = Math.round((today - date) / (1000 * 60 * 60));
  return hoursAgo <  1   ? ""                   :
         hoursAgo <  24  ? `${hoursAgo}h`       :
         daysAgo <  1    ? `${hoursAgo}h`       :
        //  daysAgo <  2 ? `${daysAgo} day ago` :
         daysAgo < 30    ? `${daysAgo}d`        :
                           d3.timeFormat("%-m/%-d/%Y")(date)
}
const defaultSiteOptions = _.map(sites, site => ({
  label: site.label,
  active: true,
}))
const defaultActiveSites = _.map(_.filter(defaultSiteOptions, "active"), "label")
const localStorageActiveSitesKey = "news--active-sites"
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
    const siteOptions = _.map(sites, site => ({
      label: site.label,
      active: _.includes(activeSites, site.label),
    }))
    this.setState({ activeSites, siteOptions })
  }

  getNews = () => {
    Promise.all(sites.map(site => this.getFeed(site.url))).then(feeds => {
      const lastLoad = getFromStorage(localStorageLastLoadKey)
      const parsedLastLoad = lastLoad ? parseTime(lastLoad) : null
      const articles = _.orderBy(
        _.filter(
          _.flatMap(feeds, (feed, index) => _.map(feed.items || [], item => ({
            ...item,
            site: sites[index].label,
            pubDate: new Date(item.pubDate),
            hasBeenViewed: parsedLastLoad ? new Date(item.pubDate) < parsedLastLoad : false,
          }))),
          article => !!article && !_.startsWith(article.title, "WATCH: ")
        ),
        "pubDate",
        "desc"
      )
      this.setState({ articles })
      if (!this.isFirstLoad) {
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

  render() {
    const { articles, siteOptions, activeSites } = this.state

    return (
      <div className={this.getClassName()}>
        <ButtonGroup
          className="News__toggle"
          buttons={siteOptions}
          onChange={this.onSiteChange}
        />
        <div className="News__articles">
          {articles.map(article => _.includes(activeSites, article.site) && (
            <a className={`News__article News__article--is-${article.hasBeenViewed ? "not-new" : "new"}`} href={article.link} target="_blank" key={article.guid}>
              <div className="News__article__title">
                <div className="News__article__title__label">
                  { article.title }
                </div>
                <div className="News__article__site">
                  { article.site }
                </div>
                <div className="News__article__date">
                  { formatDate(article.pubDate) }
                </div>
              </div>
              <div className="News__article__snippet">
                { article.contentSnippet.slice(0, 200) }
              </div>
            </a>
          ))}
        </div>
      </div>
    )
  }
}

export default News
