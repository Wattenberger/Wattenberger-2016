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
    type: PropTypes.oneOf(["line", "area"]),
    data: PropTypes.array,
    xAccessor: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
    yAccessor: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
    y0Accessor: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
    interpolation: PropTypes.func,
    iteration: PropTypes.number, // for updating
  };

  static defaultProps = {
    type: "line",
    y0Accessor: 0,
    interpolation: d3.curveMonotoneX,
  };

  update = () => {
    const {type, data, xAccessor, yAccessor, y0Accessor, interpolation} = this.props

    let lineObj = d3[type]()
      .x(xAccessor)
      .curve(interpolation)
      if (type == "area") {
        lineObj.y0(y0Accessor)
        lineObj.y1(yAccessor)
      } else {
        lineObj.y(yAccessor)
    }
    const line = lineObj(data)

    this.setState({line})
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
    const {type, data, xAccessor, yAccessor, y0Accessor, interpolation, iteration, ...props} = this.props
    const {line} = this.state

    return (
      <path className={this.getClassName()} ref="path" d={line} {...props} />
    )
  }
}

export default Line
