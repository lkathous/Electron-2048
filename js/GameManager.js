// 游戏控制器
class GameManager {
  constructor(viewActuator) {
    this.viewActuator = viewActuator
    this.grid = new GridModel(this.viewActuator.tileSize)

    this.isStart = false

    this.grid.beforeCreateTile = (x, y, value) => {
      this.viewActuator.createTile(x, y, value)
    }
  }

  start() {
    this.isStart = true

    this.grid.initialize()
    this.viewActuator.initialize()

    this.pushScore()

    setTimeout(() => {
      this.grid.createTile()
      this.grid.createTile()
    } , 0)
  }

  // initialize() {
  //   this.isStart = true
  //   this.matrix = []
  //   this.score = 0
  //
  //   for (var y = 0; y < this.size; y++) {
  //     let arr = []
  //     for (var x = 0; x < this.size; x++) {
  //       arr.push(null)
  //     }
  //     this.matrix.push(arr)
  //   }
  //
  //   if (this.viewActuator) this.viewActuator.initialize()
  // }



  // createTile() {
  //   let value = Math.random() < 0.9 ? 2 : 4
  //
  //   let position = []
  //   for (let y = 0; y < this.size; y++) {
  //     let arr = this.matrix[y]
  //     for (let x = 0; x < this.size; x++) {
  //       if (arr[x] === null) {
  //         position.push(this.xyToIndex(x, y))
  //       }
  //     }
  //   }
  //   if (position.length === 0) return null
  //
  //   let positionIndex = parseInt(Math.random() * position.length)
  //   let {x, y} = this.indexToXY(position[positionIndex])
  //
  //   this.matrix[y][x] = value
  //   if (this.viewActuator) this.viewActuator.createTile(x, y, value)
  //   return positionIndex
  // }

  slide(dirction) {
    if (!this.isStart) return
    this.grid.slide(dirction, (x, y, _x, _y, value) => {
      this.viewActuator.doMove(x, y, _x, _y, value)
    })

    if (this.grid.checkLose()) {
      this.isStart = false
      setTimeout(() => alert("挑战失败~，请重新挑战！"), 300)
    }

    // // console.log(dirction);
    // if (!this.isStart) return
    //
    // let oldMatrixSeri = JSON.stringify(this.matrix)
    // let start = 0
    // let add = 1
    //
    // if (dirction === 1 || dirction === 3) {
    //   start = this.size - 1
    //   add = -1
    // }
    //
    // for (let y = start, i = 0; i < this.size; y += add, i++) {
    //   for (let x = start, j = 0; j < this.size; x += add, j++) {
    //     let value = this.matrix[y][x]
    //
    //     if (value) {
    //       let {_x, _y} = this.getObjective(x, y, value, dirction)
    //       if (_x === x && _y === y) continue
    //
    //       let _value = this.matrix[_y][_x]
    //       this.matrix[y][x] = null
    //       if (_value) {
    //         value = _value * 2
    //         this.score += value
    //         if (this.score > this.bastScore) this.bastScore = this.score
    //       }
    //       this.matrix[_y][_x] = value
    //
    //       if (this.viewActuator) this.viewActuator.doMove(x, y, _x, _y, value)
    //     }
    //   }
    // }
    // this.pushScore()
    //
    // let matrixSeri = JSON.stringify(this.matrix)
    // if (oldMatrixSeri !== matrixSeri) {
    //   this.createTile()
    //   matrixSeri = JSON.stringify(this.matrix)
    // }

    // if (matrixSeri.indexOf("null") === -1 && this.checkLose()) {
    //   this.isStart = false
    //   setTimeout(() => alert("挑战失败~，请重新挑战！"), 300)
    // }
  }

  // getObjective(x, y, value, dirction) {
  //   let {x: dire_x, y: dire_y} = this.vectors[dirction]
  //   let _x = dire_x + x
  //   let _y = dire_y + y
  //   let _value
  //   try {
  //     _value = this.matrix[_y][_x]
  //   } catch (e) {
  //     return {_x: x, _y: y}
  //   }
  //
  //   if (!_value) {
  //     if (_value === null) return this.getObjective(_x, _y, value, dirction)
  //     return {_x: x, _y: y}
  //   }
  //   if (_value === value) {
  //     return {_x, _y}
  //   } else {
  //     return {_x: x, _y: y}
  //   }
  // }
  //
  // checkLose() {
  //   for (var y = 0; y < this.size; y++) {
  //     for (var x = 0; x < this.size; x++) {
  //       let self = this.matrix[y][x]
  //
  //       try {
  //         let right = this.matrix[y][x + 1]
  //         if (self === right) return false
  //       } catch (e) {}
  //
  //       try {
  //         let down = this.matrix[y + 1][x]
  //         if (self === down) return false
  //       } catch (e) {}
  //     }
  //   }
  //   return true
  // }

  reset() {
    this.grid.score = 0
    this.grid.bastScore = 0
    this.pushScore()
  }

  pushScore() {
    this.viewActuator.setScore(this.grid.score)
    this.viewActuator.setBestScore(this.grid.bastScore)
  }

  // xyToIndex(x, y) {
  //   return y * this.size + x
  // }
  //
  // indexToXY(index) {
  //   let x = parseInt(index % this.size)
  //   let y = parseInt(index / this.size)
  //   return {x, y}
  // }
}
