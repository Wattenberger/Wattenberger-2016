import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import * as d3 from "d3"
import Axis from "./../Axis/Axis"

require('./Brush.scss')

class Brush extends Component {
  constructor(props) {
    super(props)
    this.state = {
      brush: () => {}
    }
  }

  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    xScale: PropTypes.func,
    xAxisFormatting: PropTypes.func,
    transitionDuration: PropTypes.number,
    onChange: PropTypes.func
  };

  init() {
    this.updateBrushState()
    this.update()
  }

  updateBrushState() {
    let {xScale} = this.props

    let brush = d3.svg.brush()
      .x(xScale)
      .on("brush", ::this.onBrush)

    this.setState({brush: brush})
  }

  update(props) {
    d3.select(this.refs.el)
      .transition()
        .duration(this.props.transitionDuration)
        .call(this.state.brush)
  }

  onBrush() {
    let extent = this.state.brush.extent()
    this.props.onChange(extent)
  }

  componentDidMount() {
    this.init()
  }

  componentWillReceiveProps(newProps) {
    this.update(newProps)
    if (this.props.xScale != newProps.xScale) this.updateBrushState()
  }

  getClassName() {
    return classNames("Brush", this.props.className)
  }

  render() {
    let {height, width, xScale, xAxisFormatting, transitionDuration} = this.props
    return (
      <g ref="el" className={this.getClassName()} height={height} width={width}>
        <g style={{transform: "translate3d(0, 6px, 0)"}}>
          <Axis
            axis={"x"}
            scale={xScale}
            range={xScale.range()}
            domain={xScale.domain()}
            formatting={xAxisFormatting}
            transitionDuration={transitionDuration} />
        </g>
        <rect className="Brush__background background" width={width} x="0" height="4" rx="4" ry="4"></rect>
        <rect className="Brush__extent extent" height="4"></rect>
        <g className="Brush__resize Brush__resize--e resize e" height="4"></g>
        <g className="Brush__resize Brush__resize--w resize w" height="4"></g>
      </g>
    )
  }
}

export default Brush
