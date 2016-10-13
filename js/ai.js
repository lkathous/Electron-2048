// 游戏控制器
class AI {
  constructor(gameManager) {
    this.game = gameManager
    this.grid = gameManager.grid
    this.depth = 1
    this.minSearchTime = 30
    this.run = false

    this.vectors = {
      0: {x: 0, y: -1}, // up
      1: {x: 0, y: 1}, // down
      2: {x: -1, y: 0}, // left
      3: {x: 1, y: 0} // right
    }
    this.dirc = {
      "-1": "X",
      0: "↑",
      1: "↓",
      2: "←",
      3: "→"
    }
  }

  start() {
    this.run = true
    this.execute()
  }

  stop() {
    this.run = false
  }

  execute() {
    let move = ai.getBest()
    if (!move.direction || move.direction == -1) this.game.lose()
    this.game.slide(move.direction)
    this.grid.debug()

    if (!this.run || !this.game.isStart) return
    setTimeout(() => {
      this.execute()
    }, 300)
  }

  getBest() {
    let start = (new Date()).getTime()
    let depth = this.depth
    let best
    let space

    do {
      let newBest = this.search(true, this.grid, depth, -10000, 10000)
      best = newBest
      depth++
      space = (new Date()).getTime() - start
      console.log(space);
    } while (space < this.minSearchTime && this.maxValue(this.grid.matrix) >= 128)
    // } while (false)

    console.log(`思考深度：${depth}，思考耗时：${space} 毫秒，方向：${this.dirc[best.direction]}，最高得分：${best.score}`);
    return best
  }

  eval(matrix) {
    let emptyCells = this.available(matrix)

    let smoothWeight = 0.1,
        mono2Weight  = 1.0,
        emptyWeight  = 2.7,
        maxWeight    = 1.0

    return this.smoothness(matrix) * smoothWeight
         + this.monotonicity(matrix) * mono2Weight
         + Math.log(emptyCells) * emptyWeight
         + Math.log(this.maxValue(matrix)) / Math.log(2) * maxWeight
  }

  search(playerTurn, grid, depth, alpha, beta) {
    let move = []
    let bestScore = 0

    // the maxing player
    if (playerTurn) {
      // bestScore = alpha
      for (let direction in [0, 1, 2, 3]) {
        let newGrid = grid.clone()

        let moved = newGrid.doSlide(direction)

        if (!moved || newGrid.checkLose()) continue

        let resScore
        if (depth == 0) {
          // resScore = this.eval(grid.matrix)
          resScore = grid.score
        } else {
          let result = this.search(false, newGrid, depth - 1, bestScore, beta)
          resScore = result.score
        }
        if (resScore >= bestScore) {
          if (resScore > bestScore)
            move = []
          bestScore = resScore
          move.push(direction)
        }
        // if (bestScore > beta) {
        //   let bestMove = move[parseInt(Math.random() * move.length)]
        //   return {direction: bestMove, score: bestScore}
        // }
      }
    } else {
      // bestScore = beta
      let size = grid.size
      let sam = 0
      let times = 0
      for (let value in [2, 4]) {
        value = [2, 4][value]
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            let newGrid = grid.clone()
            let tile = newGrid.matrix[y][x]
            if (tile) continue

            newGrid.matrix[y][x] = value
            let {score: resScore} = this.search(true, newGrid, depth, alpha, bestScore)
            sam += resScore
            times++
            // if (resScore > bestScore) {
            //   bestScore = resScore
            // }
            // if (bestScore < alpha) {
            //   return {score: bestScore}
            // }
          }
        }
      }
      bestScore = sam / times
    }

    let bestMove = move[parseInt(Math.random() * move.length)]
    return {direction: bestMove, score: bestScore}
  }

  /* 得分算法 */
  smoothness(matrix) {
    let smoothness = 0
    let size = matrix.length
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        if (matrix[y][x]) {
          let value = Math.log(matrix[y][x]) / Math.log(2)
          for (let direction in [3, 1]) {
            direction = [3, 1][direction]
            let target = this.grid.findPosition(x, y, direction).next

            if (target) {
              let targetValue = Math.log(matrix[target.y][target.x]) / Math.log(2)
              smoothness -= Math.abs(value - targetValue)
            }
          }
        }
      }
    }
    return smoothness
  }

  monotonicity(matrix) {
    let totals = [0, 0, 0, 0]

    // up/down direction
    for (let x = 0; x < 4; x++) {
      let current = 0
      let next = current + 1
      while (next < 4) {
        while (next < 4 && !matrix[next][x]) {
          next++
        }
        if (next>=4) next--
        let currentValue = matrix[current, x] ? Math.log(matrix[current, x]) / Math.log(2) : 0
        let nextValue = matrix[next, x] ? Math.log(matrix[next, x]) / Math.log(2) : 0
        if (currentValue > nextValue) {
          totals[0] += nextValue - currentValue
        } else if (nextValue > currentValue) {
          totals[1] += currentValue - nextValue
        }
        current = next
        next++
      }
    }

    // left/right direction
    for (let y = 0; y < 4; y++) {
      let current = 0
      let next = current + 1
      while (next < 4) {
        while (next < 4 && !matrix[y][next]) {
          next++;
        }
        if (next>=4) next--
        let currentValue = matrix[y, current] ? Math.log(matrix[y, current]) / Math.log(2) : 0
        let nextValue = matrix[y, next] ? Math.log(matrix[y, next]) / Math.log(2) : 0
        if (currentValue > nextValue) {
          totals[2] += nextValue - currentValue
        } else if (nextValue > currentValue) {
          totals[3] += currentValue - nextValue
        }
        current = next
        next++
      }
    }

    return Math.max(totals[0], totals[1]) + Math.max(totals[2], totals[3])
  }

  maxValue(matrix) {
    let size = matrix.length
    let max = 0
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        if (matrix[y][x]) {
          if (matrix[y][x] > max) {
            max = matrix[y][x]
          }
        }
      }
    }

    return max
  }

  available(matrix) {
    let size = matrix.length
    let num = 0
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        if (!matrix[y][x]) {
          num++
        }
      }
    }

    return num
  }

}
