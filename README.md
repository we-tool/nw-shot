# nw-shot

跨平台 同时测试并支持于 OSX/Windows系统


## 已知不足及原因

- 可能暂不支持多屏幕: 使用了fullscreen
- 可能暂不支持retina高清屏: canvas算法
- 进入截图时 windows上闪烁严重
- 进入截图时 需等待一定延时: 截图调用+窗口动画+图片加载耗时
- 进入截图时 cursor生效延时: enterFullscreen耗时
- 截图过程中 切换应用等 osx会出现水平滚动动画: fullscreen导致
- 退出截图时 画面轻微抖动一下: leaveFullscreen导致
- 退出截图时 需等待1s延时: leaveFullscreen+确保cursor复原耗时
