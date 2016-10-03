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

## API设计
### getMatrix()
获取游戏方块数字的二维数组，比如（-1代表没有方块）：
```JavaScript
[
	[16, 4, 2, -1],
	[32, 4, 2, -1],
	[4, 2, -1, -1],
	[2, -1, -1, -1]
]
```
### initializeGame()
初始化游戏数据，初始化游戏界面

### createCell()
空白处创建一个新方块在，9成几率是2，1成几率是4

### slide(dirction)
滑动操作，dirction可以是"↑", "↓", "←", "→"字符串，分别对应四个方向上的滑动。
