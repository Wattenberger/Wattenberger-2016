import fetch from "./utils/fetch"

const API_ROOT = "https://api.repustate.com/v3"
const API_KEY = "bd45ee2919fbe5a8303430d8e3a1332a7c71b090"

const sentimentAPI = {
  getScore(text) {
    return fetch(`${API_ROOT}/score.json?token=${API_KEY}`, {
      text
    })
  },
}

export default sentimentAPI
