console.log("app.js..");

let ipcRenderer
try {
  ipcRenderer = require('electron').ipcRenderer
} catch (e) {
  ipcRenderer = {}
}

let doAnimate = (cell, classN) => {
  classN = " " + classN
  cell.className = cell.className + classN
  setTimeout(() => {
    cell.className = cell.className.replace(classN, "")
  }, 500)
}

let game = new Game()
game.initializeGame()

// 用户操作接口
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
  game.initializeGame()
}

let test = () => {
  game.reset()
}

document.onkeydown = (e) => {
  if (event.ctrlKey && event.altKey) {
    shortKey(e.keyCode)
    return
  }

  var code = window.event ? e.keyCode : e.which
  let dirction = "";
  switch(code) {
    case 38:
    case 87:
      dirction = "↑"
      break;
    case 40:
    case 83:
      dirction = "↓"
      break;
    case 37:
    case 65:
      dirction = "←"
      break;
    case 39:
    case 68:
      dirction = "→"
      break;
  }
  if (dirction === "") return
  game.slide(dirction)
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
