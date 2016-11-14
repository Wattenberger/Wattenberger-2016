import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import * as d3 from "d3"
import * as topojson from "./topojson"

require('./Map.scss')

class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {
      map: null,
      states: null,
    }
  }

  static propTypes = {
    mapJson: PropTypes.object,
    chart: PropTypes.object,
    data: PropTypes.array,
    colorAccessor: PropTypes.func,
    initTransition: PropTypes.number,
    transition: PropTypes.number,
  };

  static defaultProps = {
    colorAccessor: _.noop,
    initTransition: 1000,
    transition: 300,
  };

  update(props) {
    let {mapJson, chart, data, colorAccessor, initTransition, transition} = props
    let {map, states} = this.state
    let {elem} = this.refs
    if (!chart) return

    let init = !map
    let path = d3.geoPath()
    map = d3.select(elem).selectAll("path")
      .data(topojson.feature(mapJson, mapJson.objects.counties).features)
    map.enter().append("path")
      .attr("class", "Map__path")
      .attr("d", path)
    if (init) map.attr("fill", "#fff")

    map.transition().duration(init ? initTransition : transition)
       .attr("fill", colorAccessor)

   if (!states) {
     states = d3.select(elem).append("path")
                .datum(topojson.mesh(mapJson, mapJson.objects.states, function(a, b) { return a !== b; }))
                .attr("class", "Map__states")
                .attr("d", path);
     this.setState({states})
   }

    this.setState({map})
  }

  componentDidMount() {
    this.update(this.props)
  }

  componentWillReceiveProps(newProps) {
    this.update(newProps)
  }

  getClassName() {
    let {id} = this.props
    return classNames(
      "Map",
      this.props.className
    )
  }

  render() {
    return (
      <g ref="elem" className={this.getClassName()}>
      </g>
    )
  }
}

export default Map
