import React, {Component} from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import * as d3 from "d3"

require('./Line.scss')

class Line extends Component {
  constructor(props) {
    super(props)
    this.state = {
      line: null
    }
  }

  static propTypes = {
    data: PropTypes.array,
    xAccessor: PropTypes.func,
    yAccessor: PropTypes.func,
    interpolation: PropTypes.func,
    dataKey: PropTypes.func,
    initTransition: PropTypes.number,
    transition: PropTypes.number,
    easing: PropTypes.func,
    onUpdate: PropTypes.func,
    iteration: PropTypes.number, // for updating
  };

  static defaultProps = {
    interpolation: d3.curveMonotoneX,
    initTransition: 1300,
    transition: 300,
    easing: d3.easeBackOut,
    onUpdate: _.noop,
  };

  update = () => {
    let {data, xAccessor, yAccessor, interpolation, dataKey, initTransition, transition, easing, onUpdate} = this.props

    let lineObj = d3.line()
      .x(xAccessor)
      .y(yAccessor)
      .curve(interpolation)
    const line = lineObj(data)

    this.setState({line})
    onUpdate(line)
  }

  componentDidMount() {
    this.update()
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.data != this.props.data ||
      prevProps.iteration != this.props.iteration
    ) this.update()
  }

  getClassName() {
    return classNames(
      "Line",
      this.props.className
    )
  }

  render() {
    const {style} = this.props
    const {line} = this.state

    return (
      <g ref="elem" className={this.getClassName()}>
        <path className="Line__path" ref="path" d={line} style={style} />
      </g>
    )
  }
}

export default Line
