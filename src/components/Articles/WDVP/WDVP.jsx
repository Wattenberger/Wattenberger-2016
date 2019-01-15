import React, {Component} from "react"
import classNames from "classnames"
import _ from "lodash"

import WDVPMap from "./WDVPMap"
import WDVPBars from "./WDVPBars"
import WDVPMetrics from "./WDVPMetrics"
import WDVPGrandPoobah from "./WDVPGrandPoobah"

import './WDVP.scss'

class WDVP extends Component {
  state = {
    selectedMapCountryName: null,
  }
  getClassName() {
    return classNames("WDVP", this.props.className)
  }
  chart = React.createRef()

  onSelectMapCountry = country => () => this.setState({ selectedMapCountryName: country })

  render() {
    const { selectedMapCountryName} = this.state

    return (
      <div className={this.getClassName()}>
          <div className="WDVP__header">
            <h1 className="WDVP__title">
              What makes a <b>good</b> country?
            </h1>
          </div>


          <div className="WDVP__content">
            <div className="WDVP__section">
              <div className="WDVP__split">
                <div className="WDVP__split__section WDVP__split__section--content">
                  <p>
                    Every country in the world is regularly tracked by a large number of metrics. Some are mundane measures (e.g., <i>population</i>, <i>physical size</i>) and others are meant to reflect quality (e.g., <i>control of corruption</i>, <i>political rights score</i>). This creates a large list of variables that could make a country “good” or “bad”, with no simple way to combine them.
                  </p>
                  <p>
                    A country like the <b>United States</b> may rank high on <i>financial freedom score</i> <WDVPMetric>92<sup>nd</sup> percentile</WDVPMetric>, but comparatively low on <i>the percent of women in parliament/congress</i> <WDVPMetric>49<sup>th</sup> percentile</WDVPMetric>.
                  </p>

                  <p>
                    Because there are no universally accepted measures of “good”, we approached this question agnostically, allowing the individual user to interrogate countries based on metrics or reference countries of their choosing.
                  </p>
                </div>

                <div className="WDVP__split__section WDVP__split__section--chart">
                  <WDVPMetrics />
                </div>
              </div>
            </div>

            <div className="WDVP__section">

              <div className="WDVP__section-header">
                <div className="WDVP__section-header__index">
                  I.
                </div>
                Country similarity map
              </div>

              <p>
                Click on a country to find what it is good (and bad) at and other countries it is similar to. The best and worst metrics for the country will display to the left and the map will recolor itself to reflect the <b className="WDVP__color-2">most similar countries</b> and <b className="WDVP__color-1">least similar countries</b> across all metrics.
              </p>

              <WDVPMap selectedCountryName={selectedMapCountryName} />

              <div className="WDVP__cards-intro">
                A few interesting things can be learned here:
              </div>
              
              <div className="WDVP__cards">
                <div className="WDVP__cards__item">
                  <div className="WDVP__cards__item__header">
                    Many countries are similar to their neighbors
                  </div>
                  For example, the Scandinavian countries are similar to each other and northern europe (they all rank high on <i>civil liberties score</i> and <i>political rights score</i>). And East African countries are similar to each other (low rankings for <i>health expenditure per person</i> and <i>government spending score</i>).
                </div>
                <div className="WDVP__cards__item">
                  <div className="WDVP__cards__item__header">
                    Some countries are not similar to their neighbors
                  </div>
                  For example, <div className="WDVP__country" onClick={this.onSelectMapCountry("Japan")}>Japan</div> is more similar to a network of english-speaking countries than it is to its neighbors (this is largely reflected in its high ranks on <i>civil liberties score</i>, <i>GDP (billions PPP)</i>, and <i>political rights score</i>).
                </div>
                <div className="WDVP__cards__item">
                  <div className="WDVP__cards__item__header">
                    Countries group based on how they appear in the news
                  </div>
                  War-torn countries are similar to each other (e.g., <div className="WDVP__country" onClick={this.onSelectMapCountry("Yemen")}>Yemen</div> groups with <div className="WDVP__country" onClick={this.onSelectMapCountry("Syria")}> Syria </div> -- low <i>overall economic freedom score</i> and <i>political stability & absence of violence</i>) and countries that lack political freedom (e.g., <div className="WDVP__country" onClick={this.onSelectMapCountry("Russia")}> Russia </div> and <div className="WDVP__country" onClick={this.onSelectMapCountry("Iran")}>Iran</div> -- low <i>financial freedom score</i>)
                </div>
                <div className="WDVP__cards__item">
                  <div className="WDVP__cards__item__header">
                    Some countries are similar to no one
                  </div>
                  For example, <div className="WDVP__country" onClick={this.onSelectMapCountry("Mongolia")}>Mongolia</div> and <div className="WDVP__country" onClick={this.onSelectMapCountry("Bhutan")}>Bhutan</div> do not correlate highly with any countries.
                </div>
              </div>

              <p>
                These observations tell us that the metrics in the dataset captures relationships between countries that make sense intuitively. This suggests that if there is a proper “axis of good”, these data are likely rich enough to find it. We merely need to select the right metrics.
              </p>
            </div>

            <div className="WDVP__section">
              <div className="WDVP__section-header">
                <div className="WDVP__section-header__index">
                  II.
                </div>
                Finding metrics
              </div>

              <p>
                To aid in metric discovery, we want to visualize all countries and metrics simultaneously. Below, we’ve plotted the values of all metrics for all countries as a grid of bars, where the bar height indicates  the  value for each metric/country combination. Select metrics on the right and the countries will be ranked by their percentile for that metric. The metrics will also be ranked by their similarity to the selected metric.
              </p>

              <WDVPBars />

              <p>
                It is clear that many metrics are correlated with each other (the same countries have high values for both metrics). Certain countries are also correlated with each other (they have similar patterns of metric values).
              </p>

              <p>
                Although we can find groupings in this space, we always see the full dimensionality of the dataset. The final visualization will try to reduce this to a single axis.
              </p>
            </div>

            <div className="WDVP__section">
              <div className="WDVP__section-header">
                <div className="WDVP__section-header__index">
                  III.
                </div>
                Axes of “goodness”
              </div>
              <p>
                This visualization lets you select axes of interest to reduce the 27 metrics to a single axis.
              </p>

              <p>
                Click on a metric, we rank other metrics by correlation. We also take the least correlated metric and rank metrics by their correlation with it.
              </p>
              <p>
                We can use these to sets of correlation values as weights to combine metrics to get a measure of <i>government spending score</i>ness (the weighted combination of metrics that are correlated with <i>government spending score</i>) and we can plot that against <i>government expenditure</i>ness  (the weighted combination of metrics that are correlated with <i>government expenditure</i>). (here “ness” just means a quality of similarity to -- we can think of a better suffix)
              </p>

              <p>
                In that space, we find an axis that is effectively equal to (<i>Variable A</i>ness- <i>Variable B</i>ness (the black arrow). We plot that as a divergent colormap on the worldmap.
              </p>

              <p>
                In this interactive visualization, the user can select a variable of interest and find countries that s
              </p>

              <p>
                Since many of these metrics are supposed to measure the quality of a government. Let’s pick the metric that is most correlated with all other metrics. The <i>government effectiveness</i> score is the single most correlated metric in the dataset. It is particularly highly correlated with <i>government integrity</i>, <i>rule of law</i>, <i>control of corruption</i>, and <i>regulatory quality</i>
              </p>

              <WDVPGrandPoobah />
            </div>

            <div className="WDVP__footer">
                <h6>
                  Methods
                </h6>
              <div className="WDVP__footer__section">
                <h6>
                  The Dataset
                </h6>
                <p>
                  <a href="https://docs.google.com/spreadsheets/d/11LhOlwsloUuA495r-04IDwciMqNrLwWGpveqpF61WXU/edit#gid=0" target="_blank" rel="noopener noreferrer">WDVP provided</a>
                </p>
              </div>

              <div className="WDVP__footer__section">
                <h6>
                  Preprocessing
                </h6>
                  <p>
                  <b>Missing data:</b> metrics with more than 20 missing country values were removed (‘Education Expenditure per person’, ‘education expenditure as % of GDP’, ‘happy planet index’, and ‘world happiness report score’)
                  </p>
                <p>
                  <b>Percentile:</b> raw values were converted to percentiles
                </p>
                <p>
                  <b>Highlow flip:</b> percentiles were reversed for metrics where low is better ('Government Spending Score', 'Political Rights Score', 'Civil Liberties Score’)
                </p>
              </div>

              <div className="WDVP__footer__section">
                <h6>
                  Analysis
                </h6>
                <p>
                  Correlations between countries and metrics were measured using the Pearson correlation coefficient.
                  We used non-negative matrix factorization (NNMF) to initialize weights. To find the axis of good in the 2D scatter plot, we used Principal Components Analysis to find the eigenvector for the largest eigenvalue. NNMF was run using matlab. All other analyses were run with custom javascript functions.
                </p>
              </div>

            </div>
        </div>
    </div>
    )
  }
}

export default WDVP


const WDVPMetric = ({ children }) => (
  <span className="WDVPMetric">
    { children }
  </span>
)