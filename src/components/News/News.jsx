import React, {Component} from "react"
import {Route} from 'react-router-dom'
import classNames from "classnames"
import rssParser from "rss-parser";
import _ from "lodash";
import * as d3 from "d3";
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
  {label: "ABC", url: "http://feeds.abcnews.com/abcnews/topstories"},
  {label: "CBS", url: "https://www.cbsnews.com/latest/rss/main"},
  {label: "NBC", url: "https://www.nbcnewyork.com/news/top-stories/?rss=y"},
  {label: "Reuters", url: "http://feeds.reuters.com/reuters/topNews/"},
]

const today = new Date()
const formatDate = date => {
  const daysAgo = Math.round((today - date) / (1000 * 60 * 60 * 24));
  const hoursAgo = Math.round((today - date) / (1000 * 60 * 60));
  return hoursAgo <  1 ? "" :
         hoursAgo <  24 ? `-${hoursAgo}h` :
         daysAgo <  1 ? `-${hoursAgo}h` :
        //  daysAgo <  2 ? `${daysAgo} day ago` :
         daysAgo < 30 ? `-${daysAgo}d` :
         d3.timeFormat("%-m/%-d/%Y")(date)
}
class News extends Component {
  constructor(props) {
    super(props)
    this.state = {
      articles: [],
    }
    this.getNews = this.getNews.bind(this)
  }

  componentDidMount() {
    this.getNews();
  }

  getClassName() {
    return classNames("News")
  }

  getNews = () => {
    Promise.all(sites.map(site => this.getFeed(site.url))).then(feeds => {

      const articles = _.orderBy(
        _.filter(
          _.flatMap(feeds, (feed, index) => _.map(feed.items || [], item => ({
            ...item,
            site: sites[index].label,
            pubDate: new Date(item.pubDate),
          }))),
          article => !!article && !_.startsWith(article.title, "WATCH: ")
        ),
        "pubDate",
        "desc"
      )
      console.log(feeds, articles)
      this.setState({ articles })
    })
  }

  getFeed = async site => {
    try {
      return await parser.parseURL(`${CORS_PROXY}${site}`)
    } catch(e) {
      console.log(e, site)
      return []
    }
  }

  render() {
    const { articles } = this.state
    return (
      <div className={this.getClassName()}>
        <div className="News__articles">
          {articles.map(article => (
            <a className="News__article" href={article.link} target="_blank" key={article.guid}>
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
