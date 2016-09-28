const {ipcRenderer} = require('electron')

console.log("test app");

let closeWindow = function() {
  console.log('closeWindow')
  ipcRenderer.send('close-window')
}

let minimizeWindow = function() {
  console.log('minimizeWindow')
  ipcRenderer.send('minimize-window')
}
