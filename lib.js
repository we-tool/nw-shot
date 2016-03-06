'use strict'
const screencapture = require('./fork/screencapture')
const async = require('async')

module.exports = function shot(gui, cb) {
  const osx = process.platform === 'darwin'
  const gwin = gui.Window.get()
  const screen = gwin.window.screen
  const width = screen.width
  const height = screen.height

  async.parallel([
    function capture(next) {
      screencapture(next)
    },
    function open(next) {
      const win = gui.Window.open('./screen.html', {
        x: -32000,
        y: -32000,
        width: width,
        height: height,
        frame: false,
        toolbar: false,
        resizable: false,
      })
      win.on('loaded', function () {
        next(null, win)
      })
      win.on('closed', function () {
        cb()
      })
    },
  ], function (err, arr) {

    if (err) {
      return gwin.window.alert(err)
    }

    const filename = arr[0]
    const win = arr[1]
    const doc = win.window.document
    const canvas = doc.querySelector('#canvas')
    const ctx = canvas.getContext('2d')
    const img = new win.window.Image()

    canvas.setAttribute('width', width)
    canvas.setAttribute('height', height)
    img.src = `file:\/\/${filename}`
    img.addEventListener('load', function () {
      // todo: retina 5k img
      ctx.drawImage(img, 0, 0, width, height)
      setTimeout(function () {
        if (osx) {
          win.hide()
          win.moveTo(0, 0)
          // win.moveTo(-6, -6) // no fullscreen
        }
        win.enterFullscreen()
        if (osx) win.show()
        win.focus()
      }, 300) // 等待窗口动画+draw时间
    })

    doc.addEventListener('keydown', function(ev) {
      if (ev.metaKey || ev.ctrlKey)
      if (ev.keyCode === 73 &&
        (ev.ctrlKey && ev.shiftKey || ev.metaKey && ev.altKey)) {
        win.showDevTools()
      }
    })
  })
}
