console.log("app.js..");

let ipcRenderer = {}
try {
  ipcRenderer = require('electron').ipcRenderer
} catch (e) {}

let viewActuator = new ViewActuator(4, document)
let game = new GameManager(viewActuator)
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
  game.reset()
}

let isAiOpen = false
let aigo = () => {
  let move = ai.getBest()
  game.slide(move.direction)

  if (!isAiOpen || !game.isStart) return
  setTimeout(() => {
    aigo()
  }, 500)
}

let aistart = () => {
  isAiOpen = true
  aigo()
}

let aistop = () => {
  isAiOpen = false
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

// 模拟操作部分
let cancelAuto = false
let keydown = code => {
  CustomEvent = document.createEvent('HTMLEvents')
  CustomEvent.initEvent('keydown', !1, !1)
  CustomEvent.keyCode = code
  document.dispatchEvent(CustomEvent)
}

let autoKeyDown = str => {
  for (var i = 0; i < str.length; i++) {
    let char = str.charAt(i)
    switch(char) {
      case "w":
      case "0":
        keydown(38)
        break;
      case "s":
      case "1":
        keydown(40)
        break;
      case "a":
      case "2":
        keydown(37)
        break;
      case "d":
      case "3":
        keydown(39)
        break;
    }
  }
}

let shortKey = code => {
  console.log("==== "+code);
  cancelAuto = false
  switch(code) {
    case 75:
      autoRandom()
      break;
    case 80:
      cancelAuto = true
      break;
  }
}
let autoRandom = () => {
  if (cancelAuto) return
  setTimeout(() => {
    console.log("hehe");
    let code = parseInt(Math.random() * 4)
    autoKeyDown("sdsdsdsdsdsdsdsdsdsdsdsdsdsdas")
    return autoRandom()
  }, 100)
}
