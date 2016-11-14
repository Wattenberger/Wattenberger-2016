import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import numeral from "numeral"
import _ from "lodash"
import * as d3 from "d3"

require('./Chart.scss')

const scaleTypes = {
  linear: d3.scaleLinear,
  ordinal: d3.scaleOrdinal,
  time: d3.scaleTime,
}

class Chart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: this.props.height,
      width: this.props.width,
      scales: [],
      isLoaded: false,
    }
  }

  static propTypes = {
    data: PropTypes.array,
    height: PropTypes.number,
    width: PropTypes.number,
    margin: PropTypes.shape({
      top: PropTypes.number,
      right: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
    }),
    scales: PropTypes.array(
        PropTypes.shape({
          id: PropTypes.string,
          type: PropTypes.oneOf(["linear", "ordinal", "time", "color"]), // also "log", "pow", "identity", "quantize", "threshold"
          domain: PropTypes.array,
          range: PropTypes.array,
          dimension: PropTypes.oneOf(["x", "y"]),
      })
    )
  };

  static defaultProps = {
    data: [],
    height: 200,
    width: 600,
    margin: {
      top: 10,
      right: 10,
      bottom: 20,
      left: 60,
    }
};

  getClassName() {
    return classNames("Chart", this.props.className)
  }

  getHeight() {
    let {height, margin} = this.props
    return height - margin.top - margin.bottom
  }

  getWidth() {
    let {width, margin} = this.props
    return width - margin.left - margin.right
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
    this.setState({height: this.getHeight()})
    this.setState({width: this.getWidth()})
  }

  createScales(scaleConfigs) {
    let {scales, width, height} = this.state
    const defaultConfig = {
      type: "linear"
    }

    scaleConfigs.forEach(config => {
      Object.assign(config, defaultConfig)
      if (!config.range) {
        config.range = config.dimension == "x" ?
                         [0, this.getWidth()] :
                         [this.getHeight(), 0]
      }
      if (!config.id) config.id = config.dimension

      let scale = scales[config.id] || scaleTypes[config.type]()
      scale.range(config.range)
      if (config.domain) scale.domain(config.domain)
      if (config.type == "ordinal") scale.rangeRoundBands([0, width], .1);
console.log(config.range, config.domain)
      scales[config.id] = scale
      this.setState({scales})
    })
  }

  componentWillMount() {
    let {scales} = this.props
    this.setSize()
    this.createScales(scales)
  }

  componentDidMount() {
    this._setSize = ::this.setSize
    window.addEventListener("resize", this._setSize)
    setTimeout(() => {
      this.setState({isLoaded: true})
    })
  }

  componentWillReceiveProps(newProps) {
    this.createScales(newProps.scales)
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
