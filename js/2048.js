// 游戏对象
class Game {
  constructor() {
    this.panelBg = document.querySelector(".gamepanel-bg")
    this.panel = document.querySelector(".gamepanel")
    this.panelLen = 4
    this.styleTag = document.querySelector("style")
    this.cellNum = 0

    this.bastRank = 0
    this.rank = 0

    this.matrix = []
    this.isStart = false
  }
  getMatrix() {
    return this.matrix
  }

  initializeGame() {
    this.cellNum = 0
    this.matrix = []
    this.isStart = true
    this.rank = 0

    document.querySelector(".point p").innerHTML = this.rank
    document.querySelector(".high p").innerHTML = this.bastRank

    let space = 90

    this.panelBg.innerHTML = ""
    this.panel.innerHTML = ""
    for (var i = 0; i < this.panelLen; i++) {
      this.matrix[i] = []
      let top = 7 + space * i

      for (var j = 0; j < this.panelLen; j++) {
        this.matrix[i][j] = -1
        this.panelBg.innerHTML += "<div class=\"cell\" x=\""+ j +"\" y=\""+ i +"\"></div>"

        let left = 7 + space * j
        this.styleTag.innerHTML += ".cell[x=\""+ j +"\"][y=\""+ i +"\"] { top: "+ top +"px; left: "+ left +"px; }"
      }

    }
    setTimeout(() => {
      this.createCell()
      this.createCell()
    } , 0)
  }

  createCell() {
    let value = Math.random() < 0.9 ? 2 : 4

    let position = []
    for (var i = 0; i < this.matrix.length; i++) {
      let arr = this.matrix[i]
      for (var j = 0; j < arr.length; j++) {
        if (arr[j] === -1) {
          position.push(this.xyToIndex(j, i))
        }
      }
    }
    if (position.length == 0) return -1

    let positionIndex = parseInt(Math.random() * position.length)
    let {x, y} = this.indexToXY(position[positionIndex])

    this.matrix[y][x] = value
    let cnum = this.cellNum
    let cell = document.createElement('div')
    cell.id = "c-" + cnum
    cell.className = "cell n-" + value
    cell.setAttribute("x", x)
    cell.setAttribute("y", y)
    cell.innerHTML = value

    this.panel.appendChild(cell)
    doAnimate(cell, "animated bounceIn")
    this.cellNum++
    return positionIndex
  }

  slide(dirction) {
    // console.log(dirction);
    if (!this.isStart) return

    let serialization = JSON.stringify(this.matrix)

    let cells = []
    let displacement_x = 0
    let displacement_y = -1

    let dirc = "y"
    let start = 0
    let add = 1

    switch(dirction) {
      case "↑":
        break;
      case "↓":
        start = this.panelLen - 1
        add = -1
        displacement_y = 1
        break;
      case "←":
        dirc = "x"
        start = 0
        add = 1
        displacement_x = -1
        displacement_y = 0
        break;
      case "→":
        dirc = "x"
        start = this.panelLen - 1
        add = -1
        displacement_x = 1
        displacement_y = 0
        break;
    }

    for (var i = 0; i < this.panelLen; i++) {
      let arr = this.panel.querySelectorAll(".cell["+ dirc +"='"+ start +"']")
      arr.forEach(cell => cells.push(cell))
      start += add
    }

    cells.forEach(cell => {
      this.move(cell, displacement_x, displacement_y)
    })

    for (var i = 0; i < this.matrix.length; i++) {
      for (var j = 0; j < this.matrix.length; j++) {
        let arr = this.panel.querySelectorAll(".cell[x='"+ j +"'][y='"+ i +"']")
        if (arr.length > 1) {
          for (var k = arr.length - 1; k >= 0; k--) {
            let cell = arr[k]
            if (k == 0) {
              let value = this.matrix[i][j]
              cell.innerHTML = value
              cell.className = "cell n-" + value
              doAnimate(cell, "animated pulse")
            } else {
              cell.parentNode.removeChild(cell)
            }
          }
        }
      }
    }

    document.querySelector(".point p").innerHTML = this.rank
    document.querySelector(".high p").innerHTML = this.bastRank

    let newSerialization = JSON.stringify(this.matrix)
    if (serialization !== newSerialization) {
      this.createCell()
      newSerialization = JSON.stringify(this.matrix)
    }

    if (newSerialization.indexOf("-1") === -1) {
      let isLose = true
      for (var i = 0; i < this.matrix.length - 1; i++) {
        if (!isLose) break
        for (var j = 0; j < this.matrix.length - 1; j++) {
          let self = this.matrix[i][j]
          let right = this.matrix[i][j + 1]
          let down = this.matrix[i + 1][j]
          if (self === right || self === down) {
            isLose = false
            break
          }
        }
      }

      if (isLose) {
        this.isStart = false
        cancelAuto = true
        setTimeout(() => alert("挑战失败~，请重新挑战！"), 100)
      }
    }
  }

  move(cell, move_x, move_y) {
    let x = parseInt(cell.getAttribute("x"))
    let y = parseInt(cell.getAttribute("y"))
    let value = parseInt(cell.innerHTML)

    while (true) {
      let _x = x + move_x
      let _y = y + move_y

      let gValue
      try {
        gValue = this.matrix[_y][_x]
      } catch (e) {}

      if (gValue) {
        if (gValue === -1) {
          x = _x
          y = _y
          continue
        }

        if (gValue === value) {
          this.setPosition(cell, _x, _y)
          return
        }
      }
      this.setPosition(cell, x, y)
      return
    }
  }

  setPosition(cell, x, y) {
    let _x = parseInt(cell.getAttribute("x"))
    let _y = parseInt(cell.getAttribute("y"))
    let value = this.matrix[_y][_x]
    this.matrix[_y][_x] = -1
    if (this.matrix[y][x] == -1) {
      this.matrix[y][x] = 0
    } else {
      this.rank += this.matrix[y][x] * 2
      if (this.rank > this.bastRank) {
        this.bastRank = this.rank
      }
    }
    this.matrix[y][x] += value
    cell.setAttribute("x", x)
    cell.setAttribute("y", y)
  }

  reset() {
    this.bastRank = 0
    document.querySelector(".high p").innerHTML = 0
  }

  xyToIndex(x, y) {
    return y * this.panelLen + x
  }

  indexToXY(index) {
    let x = parseInt(index % this.panelLen)
    let y = parseInt(index / this.panelLen)
    return {x, y}
  }
}
