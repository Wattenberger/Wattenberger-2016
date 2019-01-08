import React, {Component} from "react"
import {Route} from 'react-router-dom'
import {connect} from "react-redux"
import classNames from "classnames"
import Footer from "components/Footer/Footer"

import Home from "components/Home/Home"
import Sketches from "components/Sketches/Sketches"
// import RochesterRealEstate from "components/Articles/RochesterRealEstate/RochesterRealEstate"
// import Headlines from "components/Articles/Headlines/Headlines"
// import FamilyTree from "components/Articles/FamilyTree/FamilyTree"
// import JournalistDeaths from 'components/Articles/JournalistDeaths/JournalistDeaths';
// import HealthCare from 'components/Articles/HealthCare/HealthCare';
import DogNames from 'components/Articles/DogNames/DogNames';
import DogBreeds from 'components/Articles/DogBreeds/DogBreeds';
import WDVP from 'components/Articles/WDVP/WDVP';
import WDVPGrid from 'components/Articles/WDVP/WDVPGrid';
import RocDevSurvey from 'components/Articles/RocDevSurvey/RocDevSurvey';
// import DoctorateStats from 'components/Articles/DoctorateStats/DoctorateStats';
import News from 'components/News/News';

require('styles/app.scss')
require('./App.scss')

@connect(state => ({}))
class App extends Component {
  getClassName() {
    return classNames("App")
  }

  render() {
    return (
      <div className={this.getClassName()}>
        <Route exact path="/" component={Home} />
        <Route path="/sketches" component={Sketches} />
        {/* <Route path="/rochester-real-estate" component={RochesterRealEstate} /> */}
        {/* <Route path="/healthcare" component={HealthCare} /> */}
        <Route path="/dogs" component={DogNames} />
        <Route path="/dog-breeds" component={DogBreeds} />
        {/* <Route path="/family-tree" component={FamilyTree} /> */}
        <Route path="/news" component={News} />
        <Route path="/wdvp" component={WDVP} />
        <Route path="/wdvpgrid" component={WDVPGrid} />
        <Route path="/rocdev" component={RocDevSurvey} />
        {/* <Route path="/docstats" component={DoctorateStats} /> */}
        {this.props.children}
        <Footer />
      </div>
    )
  }
}

export default App
