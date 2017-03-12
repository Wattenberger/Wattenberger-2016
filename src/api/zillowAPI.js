import fetch from "./utils/fetch"
import {ZSWID} from "config/config"

const API_ROOT = "https://www.zillow.com/webservice"
const expandParams = params => Object.keys(params).map(key =>
	key + "=" + encodeURIComponent(params[key])
).join("&")

const zillowAPI = {
  getHomeInfo(id, params={}) {
  	var urlParams = _.extend({
  		"zws-id": ZSWID,
  		"zpid": id,
  		"rentzestimate": true,
  	}, params)
    return fetch(`${API_ROOT}/GetDeepComps.htm?${expandParams(urlParams)}`)
  },
  getNeighborhoodInfo(id, params={}) {
  	var urlParams = _.extend({
  		"zws-id": ZSWID,
  		// "regionId": id,
  		"state": "ny",
  		"county": "monroe",
  		"city": "rochester",
  		// "childtype": "city", // state, county, city, zipcode, and neighborhood
  	}, params)
    return fetch(`${API_ROOT}/GetRegionChildren.htm?${expandParams(urlParams)}`)
	         .then((res={}) => res["RegionChildren:regionchildren"].response.list.region)
  },
}

export default zillowAPI
