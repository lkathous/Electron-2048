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

let test = () => {
  game.testStart()
}

let aaa = (m) => {
  return ai.smoothness2(m)
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
      break;
    case 76:
      // console.log("l");
      ai.stop()
      console.log("停止ai");
      break;
  }
}
