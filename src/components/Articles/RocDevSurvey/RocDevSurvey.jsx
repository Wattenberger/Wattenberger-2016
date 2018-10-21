import React, {Component} from "react"
import PropTypes from "prop-types"
import numeral from "numeral"
import * as d3 from "d3"
import classNames from "classnames"
import _ from "lodash"
import Tooltip from "components/_ui/Tooltip/Tooltip"
import dataExperience from "./experience.json"
import dataManagement from "./management.json"
import dataRace from "./race.json"
import dataRemote from "./remote.json"
import dataSize from "./size.json"
import dataTime from "./time.json"

const formatSalary = d => numeral(d).format("$0,0")
const formatNumber = d => numeral(d).format("0,0")
const ordinalColors = ["#c7ecee", "#778beb", "#f7d794", "#63cdda", "#cf6a87", "#e77f67", "#786fa6", "#FDA7DF", "#4b7bec", "#778ca3"];
const colorScale = d3.scaleLinear().range(["#c7ecee", "#686de0"]).domain([0, 1])
const datasets = {
  experience: {
    label: "Years of Experience",
    data: dataExperience,
    key: "yoe",
    options: ["<2", "3-5", "6-10", "11-15", "16+", ],
    isOrdinal: true,
    formatOption: d => `${d} years`,
  },
  management: {
    label: "Is Management",
    data: dataManagement,
    formatOption: d => d == "true" ? "Management" : "Not management",
  },
  race: {
    label: "Race",
    data: _.map(dataRace, d => ({
      ...d,
      race: _.includes(d.race, ", ") ? "Mixed" : d.race,
    })),
    filteredKeys: ["Prefer not to say"],
    formatOption: d => d,
  },
  remote: {
    label: "Is Remote",
    data: dataRemote,
    formatOption: d => d == "true" ? "Remote" : "Not remote",
  },
  size: {
    label: "Company Size (# Employees)",
    data: dataSize,
    key: "num_employees",
    options: [ "1", "2-10", "11-50", "51-200", "201-500", "501-1000", "1001-2000", "2001-5000", "5001-10000", "10001+", ],
    isOrdinal: true,
    formatOption: d => `${d} employees`,
    formatOptionLegend: d => d,
  },
  time: {
    label: "Employment Status",
    data: dataTime,
    key: "ftcon",
    formatOption: d => d,
  },
}

const parsedDatasets =_.map(datasets, (dataset, key) => {
  key = dataset.key || key
  const data = _.filter(dataset.data, d => !_.includes([null, ...(dataset.filteredKeys || [])], d[key]))
  const counts = _.countBy(data, key)
  const maxCount = _.max(_.values(counts))
  const options = dataset.options || _.keys(counts)
  const countsBySalary = _.fromPairs(_.map(_.groupBy(data, "salary"), (children, salary) => [salary, _.countBy(children, key)]))
  const maxCountBySalary = _.max(_.flatMap(_.values(countsBySalary), d => _.values(d)))
  const means = _.fromPairs(
    _.map(_.groupBy(data, key), (salaries, group) => [
      group,
      _.meanBy(salaries, "salary"),
    ])
  )
  const colors = dataset.isOrdinal ?
    _.times(options.length, i => colorScale(i / (options.length - 1))) :
    ordinalColors
  const keyColors = _.zipObject(options, colors)
  const extent = d3.extent(_.map(data, "salary"))
  const xScale = d3.scaleLinear().domain(extent);
  const buckets = d3.histogram()
    .domain(extent)
    .thresholds(xScale.ticks(10))
  const bins = buckets(data);

  return {
    ...dataset,
    key,
    data,
    counts,
    means,
    maxCount,
    maxCountBySalary,
    countsBySalary,
    options,
    colors: keyColors,
    bins,
  }
})
console.log({parsedDatasets})


// const parsedData = _.map(data, (info, name) => _.extend({}, info, {
//   name,
//   date: new Date(_.get(info, "Date")),
//   job: _.get(info,"Job").split(", "),
// }))
// console.table(_.first(parsedData))
// const jobs = _.sortBy(_.filter(_.toPairs(_.countBy(_.map(_.flatMap(parsedData, "job"), job => job.replace(" / ", "/")))), "0"), d => -_.get(d, 1))
// console.log(jobs)
// const total = parsedData.length;
// const genders = _.sortBy(_.filter(_.toPairs(_.countBy(parsedData, "Gender")), "0"), d => -_.get(d, 1))

require('./RocDevSurvey.scss')

class RocDevSurvey extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    this.parseData();
  }

  getClassName() {
    return classNames("RocDevSurvey", this.props.className)
  }

  parseData = () => {
  }

  render() {
    const {  } = this.state

    return (
      <div className={this.getClassName()}>
        <div className="RocDevSurvey__title-container">
          <h2 className="RocDevSurvey__title">
            RocDev Salary Survey
          </h2>
        </div>
        <div className="RocDevSurvey__contents">

              <div className="RocDevSurvey__group RocDevSurvey__group--legend">
                <div className="RocDevSurvey__group__legend">
                  <div className="RocDevSurvey__group__content">
                    <div className="RocDevSurvey__bars">
                      <div className="RocDevSurvey__bars__item">
                        <div className="RocDevSurvey__bars__item__text">
                          <div className="RocDevSurvey__bars__item__text__label">
                          </div>
                          <div className="RocDevSurvey__bars__item__text__mean">
                            <div className="RocDevSurvey__histogram__mean" />
                              Mean
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="RocDevSurvey__histograms">
                        <div className="RocDevSurvey__histogram">
                          {_.map(_.first(parsedDatasets).bins, (bin) => (
                            <div className="RocDevSurvey__histogram__item" key={bin.x0}>
                              <div className="RocDevSurvey__histogram__item__text">
                                <span className="RocDevSurvey__number-prefix">$</span>{ formatNumber(bin.x0 / 1000) }k
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

        {_.map(parsedDatasets, (dataset, key) => (
            <div className="RocDevSurvey__group" key={dataset.key}>
              <h3 className="RocDevSurvey__group__label">
                { dataset.label || dataset.key }
              </h3>
              <div className="RocDevSurvey__group__content">
                <div className="RocDevSurvey__bars">
                  {_.map(dataset.options, option => (
                    <div className="RocDevSurvey__bars__item" key={option}>
                      <div className="RocDevSurvey__bars__item__text">
                        <div className="RocDevSurvey__bars__item__text__label">
                          { dataset[dataset.formatOptionLegend ? "formatOptionLegend" : "formatOption"](option) }
                        </div>
                        <div className="RocDevSurvey__bars__item__text__mean">
                          { formatSalary(dataset.means[option]) }
                        </div>
                      </div>
                      <div className="RocDevSurvey__bars__item__bar" style={{
                        width: `${(dataset.counts[option] * 100) / dataset.maxCount}%`,
                        // background: dataset.colors[option],
                      }} />
                    </div>
                  ))}
                </div>

                <div className="RocDevSurvey__histograms">
                  {_.map(dataset.options, (option, i) => (
                    <div className="RocDevSurvey__histogram" key={option}>
                    {/* <div className="RocDevSurvey__histogram__item__legend">
                    { formatSalary(bin.x0 / 1000) }k
                  </div> */}
                        <div className="RocDevSurvey__histogram__mean"
                          style={{
                            left: `${((dataset.means[option] - _.first(dataset.bins).x0) * 100) / ((_.last(dataset.bins).x1 + 10000) - _.first(dataset.bins).x0)}%`,
                          }}
                        />
                      {_.map(dataset.bins, (bin) => (
                        <div className="RocDevSurvey__histogram__item" key={bin.x0}>
                          <div className="RocDevSurvey__histogram__item__bar" style={{
                            // height: `${(((dataset.countsBySalary[bin.x0] || {})[option] ||0) * 100) / dataset.maxCountBySalary}%`,
                            // background: dataset.colors[option],
                            opacity: ((dataset.countsBySalary[bin.x0] || {})[option] ||0) / dataset.maxCountBySalary,
                            zIndex: dataset.maxCountBySalary - ((dataset.countsBySalary[bin.x0] || {})[option] ||0),
                          }}>
                          </div>
                          <Tooltip className="RocDevSurvey__histogram__item__tooltip">
                            { dataset.formatOption(option) }: { formatSalary(bin.x0) } ({ (dataset.countsBySalary[bin.x0] || {})[option] ||0 })
                          </Tooltip>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

               {/*  <div className="RocDevSurvey__histogram">
                  {_.map(dataset.bins, (bin) => (
                    <div className="RocDevSurvey__histogram__item" key={bin.x0}>
                      <div className="RocDevSurvey__histogram__item__legend">
                        { formatSalary(bin.x0 / 1000) }k
                      </div>
                      {_.map(dataset.options, (option, i) => (
                        <Tooltip className="RocDevSurvey__histogram__item__bar" key={option} style={{
                          height: `${(((dataset.countsBySalary[bin.x0] || {})[option] ||0) * 100) / dataset.maxCountBySalary}%`,
                          background: dataset.colors[option],
                          zIndex: dataset.maxCountBySalary - ((dataset.countsBySalary[bin.x0] || {})[option] ||0),
                        }}>
                          { option }: { formatSalary(bin.x0) } ({ (dataset.countsBySalary[bin.x0] || {})[option] ||0 })
                        </Tooltip>
                      ))}
                    </div>
                  ))}
                </div> */}
            </div>
          </div>
        ))}

        <div className="RocDevSurvey__footer">
          <p>
            Using 2018 Rochester survey data - <a href="https://github.com/585-software/compensation-survey-2018">repo here</a>
          </p>
        </div>
      </div>
    </div>
    )
  }
}

export default RocDevSurvey