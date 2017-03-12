import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import numeral from "numeral"
import _ from "lodash"
import * as d3 from "d3"

require('./Chart.scss')

export const getHeight = (height, margin={top: 0, bottom: 0}) => height - margin.top - margin.bottom
export const getWidth = (width, margin={left: 0, right: 0}) => width - margin.left - margin.right

class Chart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: this.props.height,
      width: this.props.width,
      isLoaded: false,
    }
  }

  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    margin: PropTypes.shape({
      top: PropTypes.number,
      right: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
    }),
  };

  static defaultProps = {
    height: 200,
    width: 600,
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
};

  getClassName() {
    return classNames("Chart", this.props.className)
  }

  getWrapperStyle() {
    let {margin} = this.props
    let translate = `translate3d(${margin.left}px, ${margin.top}px, 0)`
    return {
      transform: translate,
      WebkitTransform: translate
    }
  }

  setSize() {
    let {height, width, margin} = this.props
    this.setState({height: getHeight(height, margin)})
    this.setState({width: getWidth(width, margin)})
  }

  componentWillMount() {
    this.setSize()
  }

  componentDidMount() {
    this._setSize = ::this.setSize
    window.addEventListener("resize", this._setSize)
    setTimeout(() => {
      this.setState({isLoaded: true})
    })
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this._setSize)
  }

  renderClipPath() {
    let {height, width} = this.state
    let {margin} = this.props

    return <clipPath id="chartPath-clip">
      <rect className="Chart__clip-path"
        x={margin.left}
        y={margin.top}
        height={height}
        width={width}
      />
    </clipPath>
  }


  render() {
    let {height, width, children, line, area, bar, xAxis, yAxis, brush, hasTooltip} = this.props

    return (
      <div ref="elem" className={this.getClassName()}>
        <svg className="Chart__svg" height={height} width={width}>
          <defs>
            {this.renderClipPath()}
          </defs>
          <g className="Chart__wrapper" style={this.getWrapperStyle()}>
            {children}
          </g>
        </svg>
      </div>
    )
  }
}

export default Chart
