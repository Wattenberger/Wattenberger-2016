import React from "react"
import Day1 from "./sketches/Day1"
import Day2 from "./sketches/Day2"
import Day3 from "./sketches/Day3"
import Day4 from "./sketches/Day4"
import Day5 from "./sketches/Day5"
import Day6 from "./sketches/Day6"
import Day7 from "./sketches/Day7"
import Day8 from "./sketches/Day8"

export const list = [
  {elem: Day1},
  {elem: Day2},
  {elem: Day3},
  {elem: Day4},
  {elem: Day5},
  {elem: Day6},
  {elem: Day7},
  {elem: Day8, notes: [
    {
      url: "http://creativejs.com/resources/requestanimationframe/",
      title: "Creative JS on requestAnimationFrame",
      points: [
        "Use requestAnimationFrame instead of a timeout/interval because it pays attention to browser events (such as an inactive tab) and waits to render until repaint."
      ],
    }, {
      url: "http://caniuse.com/#feat=requestanimationframe",
      title: "canIUse",
      text: "requestAnimationFrame is browser friendly (other than Opera Mini)"
    }
  ]},
  // EOL
]
