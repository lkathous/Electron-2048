console.log("app.js..");

let ipcRenderer = {}
try {
  ipcRenderer = require('electron').ipcRenderer
} catch (e) {}

let viewActuator = new ViewActuator(4, document)
let game = new GameManagement(viewActuator)
game.start()

let ai = new AI(game)

// 用户操作
let closeWindow = () => {
  console.log('closeWindow')
  ipcRenderer.send('close-window')
}

let minimizeWindow = () => {
  console.log('minimizeWindow')
  ipcRenderer.send('minimize-window')
}

let start = () => {
  console.log('start')
  game.start()
}

// 将局面更新为matrix，并开启测试
let test = (matrixStr) => {
  if (!matrixStr) {
    matrixStr = "2 0 0 2, 0 0 4 4, 0 0 8 8, 8 16 32 8"
  }

  game.testStart(buildM(matrixStr))
}

// 输入字符串"0 2 0 0, 0 4 0 0, 2 2 0 0, 0 0 0 0"，得到对应matrix二维数组
let buildM = (m) => {
  let matrix = []
  let rows = m.split(", ")
  rows.forEach(row => {
    let nums = row.split(" ")
    let arr = []
    nums.forEach(num => {
      if (num == 0) {
        arr.push(null)
      } else {
        arr.push(parseInt(num))
      }
    })
    matrix.push(arr)
  })

  return matrix
}

document.onkeydown = (e) => {
  if (event.ctrlKey && event.altKey) {
    shortKey(e.keyCode)
    return
  }

  var code = window.event ? e.keyCode : e.which
  let direction = "";
  switch(code) {
    case 38:
    case 87:
      // direction = "↑"
      direction = 0
      break;
    case 40:
    case 83:
      // direction = "↓"
      direction = 1
      break;
    case 37:
    case 65:
      // direction = "←"
      direction = 2
      break;
    case 39:
    case 68:
      // direction = "→"
      direction = 3
      break;
  }
  if (direction === "") return
  game.slide(direction)
}

let shortKey = code => {
  switch(code) {
    case 74:
      // console.log("j");
      game.grid.debug()
      ai.execute()
      console.log("=====================================");
      break;
    case 75:
      // console.log("k");
      ai.start()
      console.log("开始ai");
      document.querySelector(".toolbar .t-left").innerHTML = "lk` (自动游戏)"
      break;
    case 76:
      // console.log("l");
      ai.stop()
      console.log("停止ai");
      document.querySelector(".toolbar .t-left").innerHTML = "lk`"
      break;
  }
}
