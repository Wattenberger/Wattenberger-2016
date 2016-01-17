import sentimentAPI from "api/sentimentAPI"

export const fetchScore = (text) => {
  return sentimentAPI.getScore(text)
}
