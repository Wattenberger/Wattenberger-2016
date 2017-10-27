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
    dataKey: PropTypes.func,
    initTransition: PropTypes.number,
    transition: PropTypes.number,
    easing: PropTypes.func,
    onUpdate: PropTypes.func,
  };

  static defaultProps = {
    initTransition: 1300,
    transition: 300,
    easing: d3.easeBackOut,
    onUpdate: _.noop,
  };

  update = (props) => {
    let {data, xAccessor, yAccessor, dataKey, initTransition, transition, easing, onUpdate} = (props || this.props)

    let lineObj = d3.line()
      .x(xAccessor)
      .y(yAccessor)
    const line = lineObj(data)

    this.setState({line})
    onUpdate(line)
  }

  componentDidMount() {
    this.update()
  }

  componentWillReceiveProps(newProps) {
    this.update(newProps)
  }

  getClassName() {
    return classNames(
      "Line",
      this.props.className
    )
  }

  render() {
    let {line} = this.state
    return (
      <g ref="elem" className={this.getClassName()}>
        <path className="Line__path" ref="path" d={line} />
      </g>
    )
  }
}

export default Line
