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

  slide(dirction) {
    if (!this.isStart) return
    this.grid.slide(dirction, (x, y, _x, _y, value) => {
      this.viewActuator.doMove(x, y, _x, _y, value)
    })

    this.pushScore()

    if (this.grid.checkLose()) {
      this.isStart = false
      setTimeout(() => alert("挑战失败~，请重新挑战！"), 300)
    }
  }

  reset() {
    this.grid.score = 0
    this.grid.bastScore = 0
    this.pushScore()
  }

  pushScore() {
    this.viewActuator.setScore(this.grid.score)
    this.viewActuator.setBestScore(this.grid.bastScore)
  }

}
