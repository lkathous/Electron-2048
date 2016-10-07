// 视图控制器
class ViewActuator {
  constructor(size, elem) {
    this.panelBgDiv = elem.querySelector(".gamepanel-bg")
    this.panelDiv = elem.querySelector(".gamepanel")
    this.scoreP = elem.querySelector(".score p")
    this.bestP = elem.querySelector(".best p")
    this.styleTag = document.querySelector("style")

    this.tileSize = size
    this.tileIndex = 0
  }

  initialize() {
    this.tileIndex = 0
    this.scoreP.innerHTML = 0

    this.panelBgDiv.innerHTML = ""
    this.panelDiv.innerHTML = ""
    let space = 90
    for (var i = 0; i < this.tileSize; i++) {
      let top = 7 + space * i

      for (var j = 0; j < this.tileSize; j++) {
        this.panelBgDiv.innerHTML += "<div class=\"tile\" x=\""+ j +"\" y=\""+ i +"\"></div>"

        let left = 7 + space * j
        this.styleTag.innerHTML += ".tile[x=\""+ j +"\"][y=\""+ i +"\"] { top: "+ top +"px; left: "+ left +"px; }"
      }
    }
  }

  setScore(score) {
    this.scoreP.innerHTML = score
  }

  setBestScore(score) {
    this.bestP.innerHTML = score
  }

  createTile(x, y, value) {
    let index = this.tileIndex
    let tile = document.createElement('div')
    tile.id = "t-" + index
    tile.className = "tile n-" + value
    tile.setAttribute("x", x)
    tile.setAttribute("y", y)
    tile.innerHTML = value

    this.panelDiv.appendChild(tile)
    this.doAnimate(tile, "animated bounceIn")
    this.tileIndex++
  }

  doMove(x, y, toX, toY, value) {
    let tile = this.getTile(x, y)
    let objectiveTile = this.getTile(toX, toY)

    tile.setAttribute("x", toX)
    tile.setAttribute("y", toY)

    if (objectiveTile) {
      objectiveTile.innerHTML = value
      objectiveTile.className = "tile n-" + value
      this.doAnimate(objectiveTile, "animated pulse")

      // let t = new Date().getTime()
      // while(1) {
      //   if (new Date().getTime() - t > 300) break
      // }

      tile.parentNode.removeChild(tile)
    }
  }

  getTile(x, y) {
    return this.panelDiv.querySelector(".tile[x='"+ x +"'][y='"+ y +"']")
  }

  doAnimate(cell, className) {
    className = " " + className
    cell.className = cell.className + className
    setTimeout(() => {
      cell.className = cell.className.replace(className, "")
    }, 500)
  }
}
