// 游戏控制器
class AI {
  constructor(gameManager) {
    this.grid = gameManager.grid
    this.depth = 2
    this.minSearchTime = 400

    this.vectors = {
      0: {x: 0, y: -1},
      1: {x: 0, y: 1},
      2: {x: -1, y: 0},
      3: {x: 1, y: 0}
    }
  }

  getBest() {
    let start = (new Date()).getTime()
    let depth = this.depth
    let best

    do {
      let newBest = this.search(true, this.grid, depth, -10000, 10000)
      if (newBest.move == -1) {
        break
      } else {
        best = newBest
      }
      depth++

      console.log("思考耗时：" + ((new Date()).getTime() - start) + "毫秒 最高得分：" + best.score);
    // } while ( (new Date()).getTime() - start < this.minSearchTime)
    } while (false)

    return best
  }

  // TODO
  search(playerTurn, grid, depth, alpha, beta) {
    let move = []
    let bestScore = 0

    // the maxing player
    if (playerTurn) {
      // baseScore = alpha
      for (let direction in [0, 1, 2, 3]) {
        let newGrid = grid.clone()

        let moved = newGrid.slide(direction)

        // let {score, notMove, lose} = this.slide(direction, newMatrix)
        if (!moved || newGrid.checkLose()) continue

        let resScore
        if (depth == 0) {
          resScore = newGrid.score
        } else {
          let result = this.search(false, newGrid, depth - 1, alpha, beta)
          resScore = result.score
        }
        if (resScore >= bestScore) {
          if (resScore > bestScore)
            move = []
          bestScore = resScore
          move.push(direction)
        }
      }
    } else {
      // baseScore = beta
      let size = grid.size
      for (let value in [2, 4]) {
        value = [2, 4][value]
        for (var y = 0; y < size; y++) {
          for (var x = 0; x < size; x++) {
            let newGrid = grid.clone()
            let tile = newGrid.matrix[y][x]
            if (tile) continue

            newGrid.matrix[y][x] = value
            let {score: resScore} = this.search(true, newGrid, depth, alpha, beta)
            if (resScore > bestScore) {
              bestScore = resScore
            }
          }
        }
      }
    }

    let bestMove = move[parseInt(Math.random() * move.length)]
    return {direction: bestMove, score: bestScore}
  }

  clone(obj) {
    return JSON.parse(JSON.stringify(obj))
  }
}
