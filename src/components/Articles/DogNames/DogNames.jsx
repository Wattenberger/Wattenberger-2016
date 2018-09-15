import React, {Component} from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"
import classNames from "classnames"
import numeral from "numeral"
import _ from "lodash"
import moment from "moment"
import {scaleLinear, format} from "d3"
import ButtonGroup from "components/_ui/Button/ButtonGroup/ButtonGroup"
import dataCsvFile from "./data.csv"
import Boroughs, { defaultBoroughs } from "./Boroughs"
import Keypress, {KEYS} from 'components/_ui/Keypress/Keypress'

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

require('./DogNames.scss')

const formatNumber = d3.format(",")
const excludedItemsByAspect = {
  breed: ["Mixed/Other"],
  dog_name: ["n/a"],
}
const filterableAspects = ["breed", "dog_name"]
class DogNames extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      breeds: [],
      names: [],
      selectedItem: null,
      boroughData: null,
      totals: {
        name: {},
        breed: {},
      },
      boroughTotals: null,
    }
  }

  componentDidMount() {
    this.parseData();
  }

  getClassName() {
    return classNames("DogNames", this.props.className)
  }

  getOrderedListByAspect = (list, aspect) => (
    _.orderBy(
      _.filter(
        _.toPairs(
          _.countBy(list, aspect)
        ),
      d => !_.includes(excludedItemsByAspect[aspect] || [], d[0])),
    "1", "desc")
  )

  parseData = () => {
    const parsedData = d3.csv(dataCsvFile, data => {
      console.table(data[0])
      console.log(_.countBy(data, "dog_name"))
      const boroughTotals = _.countBy(data, "borough");
      this.setState({ data, boroughTotals }, () => {
        this.setSelectedItem(null)(null)
      })
    })
  }

  setSelectedItem = aspect => item => {
    const { data, boroughTotals } = this.state
    const dogsOfType = item ? _.filter(data, { [aspect]: item }) : data
    const boroughData = _.countBy(dogsOfType, "borough")
    const totals = _.fromPairs(_.map(filterableAspects, aspectToTotal => [
      aspectToTotal,
      this.getOrderedListByAspect(aspect == aspectToTotal ? data : dogsOfType, aspectToTotal)
    ]))
    const boroughPercents = _.fromPairs(_.map(boroughTotals, (total, borough) => [
      borough,
      (boroughData[borough] || 0) * 100 / (total || 1),
    ]))
    this.setState({ selectedItem: item, selectedAspect: aspect, totals, boroughData, boroughPercents })
  }

  onBoroughHover = borough => {
    // const { data } = this.state
    // const filteredData = borough ? _.filter(data, { borough }) : data
    // const names = this.getOrderedListByAspect(filteredData, "dog_name", filteredNames)
    // const breeds = this.getOrderedListByAspect(filteredData, "breed", filteredBreeds)
    this.setSelectedItem(borough ? "borough" : null)(borough)
    this.setState({ selectedBorough: borough })
  }

  onMouseOutOfSelectedList = () => this.setSelectedItem(null)(null)

  render() {
    const { data, totals, boroughTotals, selectedAspect, selectedItem, boroughData, boroughPercents } = this.state

    return (
      <div className={this.getClassName()}>
        <h2>Dogs of New  York City</h2>
        <div className="DogNames__contents">
          <Boroughs
            className="DogNames__map"
            title={selectedAspect == "breed" ? `${selectedItem}s` :
              selectedAspect == "dog_name" ? `Dogs named ${selectedItem}` :
              selectedAspect == "borough" ? `Dogs in ${selectedItem == "Bronx" ? "the Bronx" : selectedItem}` :
              "All dogs"}
            data={boroughData}
            percents={boroughPercents}
            aspect={selectedAspect}
            onHover={this.onBoroughHover}
          />
          <DogNamesSelectableList
            items={totals.breed}
            selectedItem={selectedAspect == "breed" ? selectedItem : null}
            label="breed"
            onSelect={this.setSelectedItem("breed")}
            onMouseOut={selectedAspect == "breed" ? this.onMouseOutOfSelectedList : _.noop}
          />
          <DogNamesSelectableList
            items={totals.dog_name}
            selectedItem={selectedAspect == "dog_name" ? selectedItem : null}
            label="name"
            onSelect={this.setSelectedItem("dog_name")}
            onMouseOut={selectedAspect == "dog_name" ? this.onMouseOutOfSelectedList : _.noop}
          />
          {/* <div className="DogNames__bars">
            {_.map(genders, (gender, i) => (
              <React.Fragment key={i}>
                <div>
                  { gender[0] }
                </div>
                <div className="DogNames__bar" style={{
                  width: `${gender[1] * 100 / _.first(genders)[1]}%`,
                }} />
              </React.Fragment>
            ))}
          </div> */}


          {/* {_.map(data, (dog, index) => (
            <div className="DogNames__item" key={index}>
              <div className="DogNames__item__name">
                { _.get(dog, "name") }
              </div>
              <div className="DogNames__item__job">
                { _.get(dog, "Job") }
              </div>
              <div className="DogNames__item__job">
                { _.get(dog, "Gender") }
              </div>
              <div className="DogNames__item__description">
                { _.get(dog, "Description") }
              </div>
            </div>
          ))} */}


          {/* _.map(people, (d, key) => (
            <div className="DogNames__item" key={key}>
              <div className="DogNames__item__name">
                <b>{_.get(d, "NAME.last")}</b>, {_.get(d, "NAME.first")}
              </div>
              <div className="DogNames__item__dates">
                <div className="DogNames__item__dates__item">
                  {_.get(d, 'BIRT.tree.DATE.data')}
                </div>
                -
                <div className="DogNames__item__dates__item">
                  {_.get(d, 'DEAT.tree.DATE.data')}
                </div>
              </div>
            </div>
          )) */}
        </div>
      </div>
    )
  }
}

export default DogNames

class DogNamesSelectableList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchValue: "",
    }
  }

  componentDidMount() {
    this.parseItems()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.items != this.props.items) this.parseItems()
  }

  parseItems = () => {
    const { items } = this.props
    const { searchValue } = this.state

    let parsedItems = _.map(items, (item, index) => [
      ...item,
      index + 1,
    ])
    if (!_.isEmpty(searchValue)) parsedItems = _.filter(parsedItems, d => d[0].toLowerCase().includes(searchValue))
    parsedItems = _.take(parsedItems, 100)

    this.setState({ parsedItems })
  }

  onSelectLocal = item => () => this.props.onSelect(item)

  onInputChange = e => {
    const searchValue = e.target.value
    this.setState({ searchValue }, this.parseItems)
  }

  onChangeSelectedItem = delta => {
    const { parsedItems, selectedItem } = this.props
    const currentItemIndex = _.findIndex(parsedItems, d => d[0] == selectedItem)
    if (currentItemIndex == -1) return
    const nextItemIndex = _.max([0, currentItemIndex + delta % parsedItems.length])
    console.log(delta, selectedItem, currentItemIndex, nextItemIndex)
    this.props.onSelect(parsedItems[nextItemIndex])
  }

  keypresses = {
    [KEYS.UP]: this.onChangeSelectedItem.bind(this, 1),
    [KEYS.DOWN]: this.onChangeSelectedItem.bind(this, -1),
  };

  render() {
    const { items, selectedItem, label, onSelect, ...props } = this.props
    const { searchValue, parsedItems } = this.state

    return (
      <div className="DogNamesSelectableList" {...props}>
        {selectedItem && <Keypress keys={this.keypresses} />}
        <input className="DogNamesSelectableList__input" value={searchValue} placeholder={`Search for a ${label}`} onChange={this.onInputChange} />
        <div className="DogNamesSelectableList__items">
          {_.map(parsedItems, (item, i) => (
            <div className={`DogNamesSelectableList__item DogNamesSelectableList__item--is-${item[0] == selectedItem ? "selected" : "not-selected"}`} key={i} onMouseOver={this.onSelectLocal(item[0])}>
              <div className="DogNamesSelectableList__item__index">
                { item[2] }
              </div>
              <div className="DogNamesSelectableList__item__label">
                { item[0] }
              </div>
              <div className="DogNamesSelectableList__item__value">
                { formatNumber(item[1]) }
              </div>
              <div className="DogNamesSelectableList__item__bar" style={{
                width: `${item[1] * 100 / parsedItems[0][1]}%`,
              }} />
            </div>
          ))}
          {(items || []).length > (parsedItems || []).length && (
            <div className="DogNamesSelectableList__note">
              Change search for more results
            </div>
          )}
        </div>
      </div>
    )
  }
}