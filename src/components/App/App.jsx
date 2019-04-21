import React, {Component, Suspense, lazy} from "react"
import {Route, Switch} from 'react-router-dom'
import {connect} from "react-redux"
import classNames from "classnames"
import Footer from "components/Footer/Footer"
import Blog from "components/Blog/Blog"
import Loader from "components/_ui/Loader"
import Link from "components/_ui/Link"
import Header from "components/Header/Header"

const Home = React.lazy(() => import("components/Home/Home"));
const Sketches = React.lazy(() => import("components/Sketches/Sketches"));
const News = React.lazy(() => import("components/News/News"));

const DogNames = React.lazy(() => import("components/Articles/DogNames/DogNames"));
const DogBreeds = React.lazy(() => import("components/Articles/DogBreeds/DogBreeds"));
const WDVP = React.lazy(() => import("components/Articles/WDVP/WDVP"));
const WDVPGrid = React.lazy(() => import("components/Articles/WDVP/WDVPGrid"));
const RocDevSurvey = React.lazy(() => import("components/Articles/RocDevSurvey/RocDevSurvey"));
const StephenKing = React.lazy(() => import("components/Articles/StephenKing/StephenKing"));
const StephenKing3d = React.lazy(() => import("components/Articles/StephenKing3d/StephenKing3d"));
const Chaconne = React.lazy(() => import("components/Articles/Chaconne/Chaconne"));
const Playground = React.lazy(() => import("components/Articles/Playground/Playground"));
const Authors = React.lazy(() => import("components/Articles/Authors/Authors"));
const Fishing = React.lazy(() => import("components/Articles/Fishing/Fishing"));
const DVS = React.lazy(() => import("components/Articles/DVS/DVS"));
const DVSChannels = React.lazy(() => import("components/Articles/DVSChannels/DVSChannels"));
const Music = React.lazy(() => import("components/Articles/Music/Music"));

// import RochesterRealEstate from "components/Articles/RochesterRealEstate/RochesterRealEstate"
// import Headlines from "components/Articles/Headlines/Headlines"
// import FamilyTree from "components/Articles/FamilyTree/FamilyTree"
// import JournalistDeaths from 'components/Articles/JournalistDeaths/JournalistDeaths';
// import HealthCare from 'components/Articles/HealthCare/HealthCare';
// import DoctorateStats from 'components/Articles/DoctorateStats/DoctorateStats';

require('styles/app.scss')
require('./App.scss')

@connect(state => ({}))
class App extends Component {
  getClassName() {
    return classNames("App")
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0)
    }
  }

  render() {
    return (
      <div className={this.getClassName()}>
        <Header />
        <Suspense fallback={<Loader />}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/sketches" component={Sketches} />
            <Route path="/loading" component={Loader} />
            {/* <Route path="/rochester-real-estate" component={RochesterRealEstate} /> */}
            {/* <Route path="/healthcare" component={HealthCare} /> */}
            <Route path="/dogs" component={DogNames} />
            <Route path="/dog-breeds" component={DogBreeds} />
            {/* <Route path="/family-tree" component={FamilyTree} /> */}
            <Route path="/news" component={News} />
            {/* <Route path="/wdvpscatter" component={WDVP} /> */}
            <Route path="/wdvpgrid" component={WDVPGrid} />
            <Route path="/wdvp" component={WDVP} />
            <Route path="/rocdev" component={RocDevSurvey} />
            <Route path="/king" component={StephenKing} />
            <Route path="/king3d" component={StephenKing3d} />
            <Route path="/playground" component={Playground} />
            <Route path="/dvs" component={DVS} />
            <Route path="/dvs-channels" component={DVSChannels} />
            <Route path="/authors" component={Authors} />
            <Route path="/fishing" component={Fishing} />
            <Route path="/music" component={Music} />
            <Route path="/chaconne" component={Chaconne} />
            <Route path="/blog" component={Blog} />
            {/* <Route path="/docstats" component={DoctorateStats} /> */}
            <Route>
              <div style={{
                height: "90vh",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}>
                <h2>Uh oh, there's nothing here</h2>
                <Link to="/">Take me Home</Link>
              </div>
            </Route>
          </Switch>
          {this.props.children}
          <Footer />
        </Suspense>
      </div>
    )
  }
}

export default App
