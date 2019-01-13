import React, {Component} from "react"
import classNames from "classnames"
import _ from "lodash"

import WDVPMap from "./WDVPMap"
import WDVPBars from "./WDVPBars"
import WDVPMetrics from "./WDVPMetrics"

import './WDVP.scss'

class WDVP extends Component {
  getClassName() {
    return classNames("WDVP", this.props.className)
  }
  chart = React.createRef()

  render() {
    return (
      <div className={this.getClassName()}>
          <div className="WDVP__header">
            <h1 className="WDVP__title">
              What makes a “good” country?
            </h1>
            <h6 className="WDVP__header__byline">
              {/* Comparing countries across many different metrics */}
            </h6>
          </div>


          <div className="WDVP__content">
            <div className="WDVP__section">
              <p>
                Every country/government in the world is regularly tracked by a large number of indicator variables. Some are mundane measures (e.g., population, physical size) and others are meant to reflect quality (e.g., corruption, political freedom). This creates a large list of variables that could make a country “good” or “bad”, with no principled way to combine them.
              </p>

              <WDVPMetrics />

              <p>
                For example US is high for X and low for Y
              </p>
            </div>

            <div className="WDVP__section">
              <p>
                Because there are no universally accepted measures of “good” ([although the UN made a list](link)), we approached this question agnostically, allowing the individual user to interrogate countries based on indicators or references countries of their choosing.
              </p>

              <p>
                Starting with the basic premise that everyone probably already has an idea in their head of “good” countries and “bad” countries.
              </p>

              <p>
                The questions that can be asked 
                TODO: these should be defined.
              </p>
              
              <p>
                An easy way to get started exploring the data is to visualize the value of a selected indicator as a heatmap on the world map. Below you will see the world map colored by [variable_name].
              </p>
              <p>
                Click on an indicator name to recolor the map by that indicator. Mouse over each indicator to learn more about it.
              </p>

              <div className="WDVP__centered">
                <WDVPMap />
              </div>

              <p>
                This visualization is nice, because we can see all countries (and their spatial organization). However, only one indicator is visible at a time.
              </p>
            </div>

            <div className="WDVP__section">
              <p>
                To visualize all countries and all indicators at once we can plot the entire dataset as a grid of values. It is clear that many indicators are correlated with each other (the same countries have high values for both indicators). Certain countries are also correlated with each other (they have similar patterns of indicator values). HereThe user can select a country or indicator to sort by and the rows of the grid will re-organize to reveal 
              </p>
            <WDVPBars />

              <p>
              Click on an indicator, we rank other indicators by correlation. We also take the least correlated indicator and rank indicators by their correlation with it.
              </p>
              line charts
            </div>

            <div className="WDVP__section">
              <p>
                We can use these to sets of correlation values as weights to combine indicators to get a measure of “government spending score”-ness (the weighted combination of indicators that are correlated with government spending score) and we can plot that against government expenditure-ness  (the weighted combination of indicators that are correlated with government expenditure). (here “ness” just means a quality of similarity to -- we can think of a better suffix)
              </p>

              Scatter + map
            </div>

            <div className="WDVP__section">
              <p>
                In that space, we find an axis that is effectively equal to (“Variable A-ness” minus “Variable B-ness”) (the black arrow). We plot that as a divergent colormap on the worldmap.
              </p>
              <p>
                In this interactive visualization, the user can select a variable of interest and find countries that s
              </p>
            </div>

            <p>
              
The dataset: 

https://wdvp.worldgovernmentsummit.org/#faq

            </p>
        </div>
    </div>
    )
  }
}

export default WDVP

