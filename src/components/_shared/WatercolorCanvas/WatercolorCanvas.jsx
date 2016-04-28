import React, {Component} from "react"
import classNames from "classnames"
import Vector2D from "./vector2d"
import Pollock from "./pollock"
import Drip from "./drip"

require('./WatercolorCanvas.scss')
const colors = [
  // '#F7F9FE', '#ECF1F2', '#DCE8EB', '#CBDBE0', '#BED2D9'
  // "#44749D","#C6D4E1","#FFFFFF","#EBE7E0","#BDB8AD"
  // "#539FA2","#72B1A4","#ABCCB1","#C4DBB4","#D4E2B6"
  // "#C7443D", "#D9764D", "#CC9E8A", "#C1C5C7", "#EBDFC6",
  "#F7F5CD", "#F0ECAC", "#DBD786", "#AAC981", "#B6DB86", "#FFFFFF"
  // "#27191C", "#2D3839", "#114D4D", "#6E9987", "#E0E4CE",
  // "#1C120A", "#699124", "#90AD87", "#BDD1AE", "#E2E8D5"
  // "#FFF5DE", "#B8D9C8", "#917081", "#750E49", "#4D002B",
  // "#0F2405", "#2B400B", "#637E13", "#87A227", "#FBFAF2",
  // "#7F6E4F", "#CEA060", "#5D5650", "#A28C2D", "#FAF9ED", "#3E2316"
  // "#D9DADC","#9CA4AA","#E7E8ED","#F4F4F6","#E3E4E8","#4B515F"
  // "#234F4A","#161D23","#3B3F4B","#112F2E","#84998D","#8E8280", #f5f7f9", "#e0e9ee"
  // "#50426A","#A6A6A6","#7D99AB","#E2EBE8","#B3C8CD","#523A38"
  // "#007199","#002335","#004B65","#007EA4","#002D44","#00527A", "#F0ECAC", "#f5f7f9", "#e0e9ee"
  // "#4D816A",  "#7BAB9B",  "#398974",  "#035546",  "#002F23",  "#D1D5C6", "#F0ECAC", "#f5f7f9", "#e0e9ee",
  // "#F7F8FD", "#EFF4FA", "#E3EBF6", "#D9E5F5", "#262832", "#859EBE",
  // "#BDAEB3","#D7D7D7","#F6F8F6","#C1C0CE","#B2A2A2","#2E6E5E",
  // "#C8DBE9",  "#9DB2BE",  "#67686E",  "#D5DBE7",  "#6C7B8E",  "#C4DAE8",
];

class WatercolorCanvas extends Component {
  getClassName() {
    return classNames("WatercolorCanvas", this.props.className)
  }

  componentDidMount() {
    this.initPollock()
  }

  addDrip(scene, point) {
    point = point || new Vector2D(
      Pollock.randomInRange(0, scene.width),
      Pollock.randomInRange(0, scene.height)
    );
    var drip = new Drip({
      lifeSpan: Pollock.randomInRange(500, 3000),
      position: point,
      velocity: new Vector2D(
        Math.random()*2,
        Math.random()*2
      ),
      color: colors[Pollock.randomInRange(0, colors.length-1)],
      size: Pollock.randomInRange(32,96),
      // onDeath: () => {
      //   this.addDrip(scene);
      // }
    });

    scene.addChild(drip);
  }

  initPollock() {
    let scene = new Pollock({
      canvasID: "watercolorCanvas",
      clear: false
    })

    scene.enable();

    let interval = setInterval(() => {
      this.addDrip(scene);
    }, 300)
  }

  render() {
    return (
      <canvas id="watercolorCanvas" className={this.getClassName()}/>
    )
  }
}

export default WatercolorCanvas
