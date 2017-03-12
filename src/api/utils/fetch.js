import "isomorphic-fetch"
import {merge} from "lodash"
import {parseString} from "xml2js"

const defaultOptions = {
  method: "GET",
  headers: {
    'Accept': 'application/json',
    // 'Content-Type': 'application/json'
  }
}

function handleError(response) {
  if (response.ok) return response
  else throw Object.assign(
    new Error(response.statusText),
    {response}
  )
}

async function negotiateResponse(response) {
  const contentType = response.headers.get("content-type")
  const isXml = contentType.indexOf("xml")
  if (isXml) {
    let str = await response.text()
    const parseOptions = {
      explicitArray: false,
    }
    let json
    await parseString(str, parseOptions, (err, parsedStr) => {
      json = parsedStr
    })
    return json
  }
  return response.json()
}

const APIFetch = (url, options = {}) => {
  options = merge(
    {},
    defaultOptions,
    options
  )
  
  return fetch(url, options)
    .then(handleError)
    .then(negotiateResponse)
}

export default APIFetch
