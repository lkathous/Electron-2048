// 栅格模型
class GridModel {
  constructor(size) {
    this.matrix = []
    this.size = size || 4

    this.bastScore = 0
    this.score = 0

    // 上下左右
    this.vectors = {
      0: {x: 0, y: -1},
      1: {x: 0, y: 1},
      2: {x: -1, y: 0},
      3: {x: 1, y: 0}
    }

    this.beforeCreateTile = null
  }

  initialize() {
    this.matrix = []
    this.score = 0

    for (var y = 0; y < this.size; y++) {
      let arr = []
      for (var x = 0; x < this.size; x++) {
        arr.push(null)
      }
      this.matrix.push(arr)
    }
  }

  createTile() {
    let value = Math.random() < 0.9 ? 2 : 4

    let position = []
    for (let y = 0; y < this.size; y++) {
      let arr = this.matrix[y]
      for (let x = 0; x < this.size; x++) {
        if (arr[x] === null) {
          position.push(this.xyToIndex(x, y))
        }
      }
    }
    if (position.length === 0) return null

    let positionIndex = parseInt(Math.random() * position.length)
    let {x, y} = this.indexToXY(position[positionIndex])

    this.matrix[y][x] = value
    if (this.beforeCreateTile) this.beforeCreateTile(x, y, value)
  }

  slide(dirction, moveFn) {
    let moved = this.doSlide(dirction, moveFn)
    if (moved) this.createTile()
  }

  doSlide(dirction, moveFn) {
    let oldMatrixSeri = JSON.stringify(this.matrix)
    let start = 0
    let add = 1
    let exception = []

    if (dirction == 1 || dirction == 3) {
      start = this.size - 1
      add = -1
    }

    for (let y = start, i = 0; i < this.size; y += add, i++) {
      for (let x = start, j = 0; j < this.size; x += add, j++) {
        let value = this.matrix[y][x]

        if (value) {
          let target = this.findPosition(x, y, dirction)
          let {position, value: _value} = this.move(x, y, target, exception)
          if (!_value) continue
          if (moveFn) moveFn(x, y, position.x, position.y, _value)
        }
      }
    }

    let matrixSeri = JSON.stringify(this.matrix)
    if (oldMatrixSeri !== matrixSeri)
      return true
    return false
  }

  findPosition(x, y, dirction) {
    let {x: dire_x, y: dire_y} = this.vectors[dirction]
    let _x = dire_x + x
    let _y = dire_y + y
    let _value
    try {
      _value = this.matrix[_y][_x]
    } catch (e) {}

    if (_value) {
      return {
        position: {x, y},
        next: {x: _x, y: _y}
      }
    } else {
      if (_value === null) return this.findPosition(_x, _y, dirction)
    }

    return {position: {x, y}}
  }

  move(x, y, target, exception) {
    let value = this.matrix[y][x]
    let {position, next} = target

    if (position.x === x && position.y === y)
      if (!next || this.matrix[next.y][next.x] != value)
        return {}

    this.matrix[y][x] = null
    let _value
    if (next && exception.indexOf(this.xyToIndex(next.x, next.y)) == -1) {
      _value = this.matrix[next.y][next.x]
    }

    if (_value && _value == value) {
      position.x = next.x
      position.y = next.y

      value = _value * 2
      this.score += value
      if (this.score > this.bastScore) this.bastScore = this.score
      exception.push(this.xyToIndex(position.x, position.y))
    }
    this.matrix[position.y][position.x] = value

    return {position, value}
  }

  checkLose() {
    for (var y = 0; y < this.size; y++) {
      for (var x = 0; x < this.size; x++) {
        let self = this.matrix[y][x]
        if (!self) return false

        try {
          let right = this.matrix[y][x + 1]
          if (self === right) return false
        } catch (e) {}

        try {
          let down = this.matrix[y + 1][x]
          if (self === down) return false
        } catch (e) {}
      }
    }
    return true
  }

  reset() {
    this.score = 0
    this.bastScore = 0
  }

  xyToIndex(x, y) {
    return y * this.size + x
  }

  indexToXY(index) {
    let x = parseInt(index % this.size)
    let y = parseInt(index / this.size)
    return {x, y}
  }

  clone() {
    let g = new GridModel(this.size)
    g.matrix = JSON.parse(JSON.stringify(this.matrix))
    g.score = this.score
    return g
  }

  debug() {
    let arr = []
    for (var y = 0; y < this.size; y++) {
      for (var x = 0; x < this.size; x++) {
        let self = this.matrix[y][x]
        if (!self) {
          arr.push("      ")
          continue
        }
        self = self + ""
        if (self.length == 1) {
          arr.push(`   ${self}  `)
        }
        if (self.length == 2) {
          arr.push(`  ${self}  `)
        }
        if (self.length == 3) {
          arr.push(`  ${self} `)
        }
        if (self.length == 4) {
          arr.push(` ${self} `)
        }
      }
    }
    let i = 0
    console.log(`_____________________________`)
    console.log(`|${arr[i++]}|${arr[i++]}|${arr[i++]}|${arr[i++]}|`)
    console.log(`|${arr[i++]}|${arr[i++]}|${arr[i++]}|${arr[i++]}|`)
    console.log(`|${arr[i++]}|${arr[i++]}|${arr[i++]}|${arr[i++]}|`)
    console.log(`|${arr[i++]}|${arr[i++]}|${arr[i++]}|${arr[i++]}|`)
    console.log(`ˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉ`)
  }
}
