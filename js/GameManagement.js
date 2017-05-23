// 游戏控制器
class GameManagement {
  constructor(viewActuator) {
    this.viewActuator = viewActuator
    this.grid = new GridModel(this.viewActuator.tileSize)

    this.isStart = false
    this.debug = false

    this.grid.beforeCreateTile = (x, y, value) => {
      this.viewActuator.createTile(x, y, value)
    }
  }

  start() {
    this.isStart = true
    this.debug = false

    this.grid.initialize()
    // this.grid.debug()
    this.viewActuator.initialize(this.grid.matrix)

    this.pushScore()

    setTimeout(() => {
      this.grid.createTile()
      this.grid.createTile()
    } , 0)
  }
  testStart() {
    this.isStart = true
    this.debug = true

    this.grid.initialize()
    this.grid.matrix = [
      [4, 16, 4, 2],
      [2, 8, null, null],
      [null, 8, null, null],
      [null, 2, null, null]
    ] // TODO TEST
    this.grid.debug()
    this.viewActuator.initialize(this.grid.matrix)

    this.pushScore()
  }

  slide(dirction) {
    if (!this.isStart) return
    this.grid.slide(dirction, (x, y, _x, _y, value) => {
      this.viewActuator.doMove(x, y, _x, _y, value)
    })

    this.pushScore()

    if (this.grid.checkLose()) {
      this.lose()
    }
  }

  lose() {
    this.isStart = false
    setTimeout(() => alert("挑战失败~，请重新挑战！"), 300)
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
