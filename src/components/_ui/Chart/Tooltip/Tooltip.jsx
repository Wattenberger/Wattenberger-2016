import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import * as d3 from "d3"

require('./Tooltip.scss')
const orientations = {
  x: "bottom",
  y: "left"
}
const typeMap = {
  scatter: ".dot",
  map: ".Map__path"
}

class Tooltip extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hovered: null,
      showing: false
    }
  }

  static propTypes = {
    type: PropTypes.oneOf(["scatter", "map"]),
    elem: PropTypes.object,
    renderElem: PropTypes.func,
    scales: PropTypes.shape({
      x: PropTypes.string,
      y: PropTypes.string,
    }),
    xAccessor: PropTypes.func,
    yAccessor: PropTypes.func,
  };

  static defaultProps = {
    scales: {x:"x", y:"y"}
  };

  getStyle() {
    let {xAccessor, yAccessor} = this.props
    let {hoveredPoint, showing} = this.state
    if (!hoveredPoint) return {opacity: 0}

    return {
      left: `${xAccessor(hoveredPoint)}px`,
      top: `${yAccessor(hoveredPoint)}px`,
      opacity: showing ? 1 : 0
    }
  }

  update(props) {
    let {type, elem} = props
    if (!elem || !elem.refs || !elem.refs.elem) return
    this._onMouseover = ::this.onMouseover
    this._onMouseout = ::this.onMouseout
    this._listener = d3.select(elem.refs.elem).selectAll(typeMap[type])
    this._listener.on("mouseover", this._onMouseover)
    this._listener.on("mouseout", this._onMouseout)
  }

  onMouseover(d){
    this.setState({hoveredPoint: d})
    this.setState({showing: true})
  }

  onMouseout(d){
    this.setState({showing: false})
  }

  componentDidMount() {
    this.update(this.props)
  }

  componentWillReceiveProps(newProps) {
    this.update(newProps)
  }

  componentWillUnmount() {
    this._listener.off("mouseover", this._onMouseover)
  }

  getClassName() {
    let {id} = this.props
    let {elem} = this.refs

    let domElem = d3.select(elem)._groups[0][0] || {}
    let offset = domElem.offsetTop
    let height = domElem.offsetHeight
    let scroll = window.scrollY

    return classNames(
      "Tooltip", {
        "Tooltip--flipY": offset - height < scroll,
      },
      this.props.className
    )
  }

  render() {
    let {hoveredPoint} = this.state

    return (
      <div ref="elem" className={this.getClassName()} style={this.getStyle()}>
        {hoveredPoint && this.props.renderElem(hoveredPoint)}
      </div>
    )
  }
}

export default Tooltip
