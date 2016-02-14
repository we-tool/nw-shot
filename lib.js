'use strict'
const screencapture = require('screencapture')
const async = require('async')

module.exports = function shot(gui) {
  const screen = gui.Window.get().window.screen
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
        setTimeout(function () {
          next(null, win)
        }, 200) // 等待窗口动画
      })
    },
  ], function (err, arr) {

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
      ctx.drawImage(img, 0, 0, width, height)
      setTimeout(function () {
        win.moveTo(0, 0)
        win.focus()
      }, 200) // 等待窗口动画+draw时间
    })

    doc.addEventListener('keydown', function(ev) {
      if (ev.keyCode === 73 && ev.ctrlKey && ev.shiftKey) {
        win.showDevTools()
      }
    })
  })
}
