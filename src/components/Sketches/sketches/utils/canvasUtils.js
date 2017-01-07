export const canvasUtils = {
  fadeCanvas(pct=1, canvas={}, rgb="255, 255, 255", params) {
    const defaults = {
      width: window.innerWidth,
      height: 400,
    }
    let config = _.extend({}, defaults, params)

    canvas.fillStyle = `rgba(${rgb}, ${pct})`
    canvas.fillRect(0, 0, config.width, config.height)
  },

  createPathMethods(points=[], canvas={}) {
    // point: type, args
    canvas.beginPath()
    let moveTo = true

    points.map((point, idx) => {
      let method = point.type || (moveTo ? "moveTo" : "lineTo")
      canvas[method](...point.args)
      moveTo = !!point.type
    })
  },

  drawDot(point={}, canvas={}, color="#fff", style="fill") {
    canvas[`${style}Style`] = color
    this.createPathMethods([
      {
        type: "arc",
        args: [point.x, point.y, point.r || 2, 0, Math.PI * 2, false]
      },
    ], canvas)
    canvas[style]()
  },
}
