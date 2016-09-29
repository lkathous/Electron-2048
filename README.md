# Electron-2048

## 使用工具
1. electron
2. jQuery
3. Font Awesome
4. animate.css

## electron配置
### package.json
```JavaScript
{
	"name": "2048",
	"version": "0.0.1",
	"description": "2048. A popular game",
	"main": "main.js",
	"author": "lkathous"
}
```

### main.js窗口配置（部分）
```JavaScript
mainWindow = new BrowserWindow({
	frame: false,
	width: 420,
	height: 620,
	resizable: false,
	transparent: true,

	autoHideMenuBar: true
})
```

### 外观设计
基本上模拟2048App的外观

![https://raw.githubusercontent.com/lkathous/Electron-2048/master/img/样式.png?raw=true](https://raw.githubusercontent.com/lkathous/Electron-2048/master/img/样式.png?raw=true)
