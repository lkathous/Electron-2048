// 游戏控制器
class AI {
  constructor(gameManager) {
    this.game = gameManager
    this.depth = 3

    this.vectors = {
      0: {x: 0, y: -1},
      1: {x: 0, y: 1},
      2: {x: -1, y: 0},
      3: {x: 1, y: 0}
    }
  }

  getBest() {
    return this.search(true, this.clone(this.game.matrix), 0, this.depth, -10000, 10000)
  }

  // TODO
  search(playerTurn, matrix, bestScore, depth, alpha, beta) {
    let bestMove = -1
    let newMatrix = this.clone(matrix)

    // the maxing player
    if (playerTurn) {
      // bestScore = alpha
      for (let direction in [0, 1, 2, 3]) {
        let {score, notMove, lose} = this.slide(direction, newMatrix)
        if (notMove, lose) continue

        if (depth == 0) {
          return { score }
        } else {
          let {score: resScore} = this.search(false, newMatrix, score + bestScore, depth - 1, alpha, beta)
          if (resScore > bestScore) {
            bestScore = resScore
            bestMove = direction
          }
        }
      }
      return {direction: bestMove, score: bestScore}

    } else {
      // bestScore = beta
      for (let value in [2, 4]) {
        value = [2, 4][value]
        for (var y = 0; y < matrix.length; y++) {
          for (var x = 0; x < matrix.length; x++) {
            let tile = newMatrix[y][x]
            if (!tile) {
              newMatrix[y][x] = value
              let {score: resScore} = this.search(true, newMatrix, bestScore, depth - 1, alpha, beta)
              if (resScore > bestScore) {
                bestScore = resScore
              }
            }
          }
        }
      }
      return {score: bestScore}
    }

  }

  slide(dirction, matrix) {
    let score = 0
    let notMove = false
    let lose = false

    let oldMatrixSeri = JSON.stringify(matrix)
    let start = 0
    let add = 1
    if (dirction == 1 || dirction == 3) {
      start = matrix.length - 1
      add = -1
    }

    for (let y = start, i = 0; i < matrix.length; y += add, i++) {
      for (let x = start, j = 0; j < matrix.length; x += add, j++) {
        let value = matrix[y][x]
        if (value) {
          let {_x, _y} = this.getObjective(x, y, value, dirction, matrix)
          if (_x === x && _y === y) continue

          let _value = matrix[_y][_x]
          matrix[y][x] = null
          if (_value) {
            value = _value * 2
            score += value
          }
          matrix[_y][_x] = value
        }
      }
    }

    let matrixSeri = JSON.stringify(matrix)
    if (oldMatrixSeri === matrixSeri) {
      notMove = true
    }

    if (matrixSeri.indexOf("null") === -1 && this.checkLose()) {
       lose = true
    }
    return {score, notMove, lose}
  }

  getObjective(x, y, value, dirction, matrix) {
    let {x: dire_x, y: dire_y} = this.vectors[dirction]
    let _x = dire_x + x
    let _y = dire_y + y
    let _value
    try {
      _value = matrix[_y][_x]
    } catch (e) {
      return {_x: x, _y: y}
    }

    if (!_value) {
      if (_value === null) return this.getObjective(_x, _y, value, dirction, matrix)
      return {_x: x, _y: y}
    }
    if (_value === value) {
      return {_x, _y}
    } else {
      return {_x: x, _y: y}
    }
  }

  checkLose() {
    for (var y = 0; y < this.size; y++) {
      for (var x = 0; x < this.size; x++) {
        let self = this.matrix[y][x]

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

  clone(obj) {
    return JSON.parse(JSON.stringify(obj))
  }
}

class GameModel {
  constructor() {
    this.isStart = true
    this.matrix = []
    this.bastRank = 0
    score = 0
    this.size = 4

    this.vectors = {
      0: {x: 0, y: -1},
      1: {x: 0, y: 1},
      2: {x: -1, y: 0},
      3: {x: 1, y: 0}
    }
  }

  slide(dirction, matrix) {
    let oldMatrixSeri = JSON.stringify(matrix)
    let start = 0
    let add = 1

    if (dirction === 1 || dirction === 3) {
      start = this.size - 1
      add = -1
    }

    for (let y = start, i = 0; i < this.size; y += add, i++) {
      for (let x = start, j = 0; j < this.size; x += add, j++) {
        let value = matrix[y][x]

        if (value) {
          let {_x, _y} = this.getObjective(x, y, value, dirction)
          if (_x === x && _y === y) continue

          let _value = matrix[_y][_x]
          matrix[y][x] = null
          if (_value) {
            value = _value * 2
            this.rank += value
            if (this.rank > this.bastRank) this.bastRank = this.rank
          }
          matrix[_y][_x] = value
        }
      }
    }

    let matrixSeri = JSON.stringify(matrix)
    if (oldMatrixSeri === matrixSeri) {

    }

    if (matrixSeri.indexOf("null") === -1 && this.checkLose()) {
      this.isStart = false
    }
  }

  getObjective(x, y, value, dirction) {
    let {x: dire_x, y: dire_y} = this.vectors[dirction]
    let _x = dire_x + x
    let _y = dire_y + y
    let _value
    try {
      _value = this.matrix[_y][_x]
    } catch (e) {
      return {_x: x, _y: y}
    }

    if (!_value) {
      if (_value === null) return this.getObjective(_x, _y, value, dirction)
      return {_x: x, _y: y}
    }
    if (_value === value) {
      return {_x, _y}
    } else {
      return {_x: x, _y: y}
    }
  }

  checkLose() {
    for (var y = 0; y < this.size; y++) {
      for (var x = 0; x < this.size; x++) {
        let self = this.matrix[y][x]

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

  setGameManager(game) {
    this.matrix = this.clone(game.matrix)
    this.bastRank = game.bastRank
    this.rank = game.rank
    this.size = game.size
  }



}
