// 游戏控制器
class AI {
  constructor(GameManagement) {
    this.game = GameManagement
    this.grid = GameManagement.grid
    this.baseDepth = 1
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
    // this.grid.debug()

    if (!this.run || !this.game.isStart) return
    setTimeout(() => {
      this.execute()
    }, 300)
  }

  getBest() {
    let start = (new Date()).getTime()
    let depth = this.baseDepth
    let best
    let space

    do {
      let newBest = this.search(true, this.grid, depth, -10000, 10000, [])
      best = newBest
      depth++
      space = (new Date()).getTime() - start
      // console.log(space);
    } while (space < this.minSearchTime && this.getMaxValue(this.grid.matrix) >= 128 && false) // TODO TEST
    // } while (false)

    console.log(`思考深度：${depth - 1}，思考耗时：${space} 毫秒，方向：${this.dirc[best.direction]}，最高得分：${best.score}`);
    return best
  }

  // 计算得分
  eval(grid) {
    if (this.game.debug) grid.debug()

    if (grid.checkLose())
      return Math.log(0)

    let matrix = grid.matrix
    // let score = Math.log(grid.score - this.grid.score)
    let score = 0

    let smoothWeight = 1,
        mono2Weight  = 1,
        // emptyWeight  = 2,
        // maxValueWeight    = 2,
        avgWeight    = 2

    let smoothness = this.smoothness2(matrix)
    let monotonicity = this.monotonicity(matrix)
    // let emptyCells = this.getExistsCount(matrix)
    // let maxValue = this.getMaxValue(matrix)
    let avgValue = this.getAvgValue(matrix)

    score += smoothness * smoothWeight
        + monotonicity * mono2Weight
        + avgValue * avgWeight

    if (this.game.debug) console.log(`平滑度: ${smoothness}, 单调性: ${monotonicity}, 平均值: ${avgValue}, 得分: ${score}`);
    return score
  }

  /**
   * 极大极小搜索算法
   *
   * @param    {boolean}  playerTurn  玩家回合
   * @param    {object}   grid        格局
   * @param    {int}      depth       深度
   * @param    {int}      alpha       阿尔法值
   * @param    {int}      beta        贝塔值
   * @param    {array}    operation   xx
   * @returns  {object} {direction: 0, score: 0}
   */
  search(playerTurn, grid, depth, alpha, beta, o) {
    let move = []
    let bestScore = 0

    // the maxing player
    if (playerTurn) {
      bestScore = alpha
      for (let direction in [0, 1, 2, 3]) {
        if (this.game.debug) console.log(`======== ${this.dirc[direction]}`);

        let newGrid = grid.clone()
        let moved = newGrid.doSlide(direction)

        // if (!moved || newGrid.checkLose()) continue
        if (!moved) continue

        let {score: resScore} = this.search(false, newGrid, depth, bestScore, beta, o)
        if (resScore >= bestScore) {
          if (resScore > bestScore)
            move = []
          bestScore = resScore
          move.push(direction)
        }
        if (bestScore > beta) {
          break
        }
      }
    } else {
      bestScore = beta
      let size = grid.size
      let sam = 0
      // let times = 0
      for (let value in [2, 4]) {
        value = [2, 4][value]
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            let newGrid = grid.clone()
            let tile = newGrid.matrix[y][x]
            if (tile) continue

            newGrid.matrix[y][x] = value

            let resScore = {}
            if (depth <= 1) {
              // console.log(o);
              resScore = this.eval(newGrid)
              // this.grid.print(newGrid.matrix)
              // resScore = grid.score
            } else {
              let result = this.search(true, newGrid, depth - 1, alpha, bestScore, o)
              resScore = result.score
            }

            // let {score: resScore} = this.search(true, newGrid, depth - 1, alpha, bestScore, operation)
            if (resScore < bestScore) {
              bestScore = resScore
            }
            if (bestScore < alpha) {
              return {score: bestScore}
            }
          }
        }
      }
    }

    let bestMove = move[parseInt(Math.random() * move.length)]
    return {direction: bestMove, score: bestScore}
  }

  /* 得分算法 */
  // 平滑度
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
    return Math.abs(smoothness < 0 ? 0 : smoothness)
  }
  smoothness2(matrix) {
    let count = 0
    let differentTotal = 0
    let maxValue = 0

    let size = matrix.length
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        if (matrix[y][x]) {
          let value = matrix[y][x]
          if (value > maxValue) {
            maxValue = value
          }

          for (let direction in [3, 1]) {
            direction = [3, 1][direction]
            let target = this.grid.findPositionInMatrix(matrix, x, y, direction).next

            if (target) {
              let targetValue = matrix[target.y][target.x]
              differentTotal += Math.abs(value - targetValue)
              count++
            }
          }
        }
      }
    }

    if (count == 0 ) return 0

    return 1 / (differentTotal / count / maxValue)
  }

  // 计算单调性
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

  // 统计最大数字
  getMaxValue(matrix) {
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

  // 统计空格子数量
  getExistsCount(matrix) {
    let size = matrix.length
    let num = 0
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        if (matrix[y][x]) {
          num++
        }
      }
    }

    return num
  }

  // 统计平均点数
  getAvgValue(matrix) {
    let size = matrix.length
    let num = 0
    let total = 0
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        if (matrix[y][x]) {
          num++
          total += matrix[y][x]
        }
      }
    }

    return total / num
  }

}
