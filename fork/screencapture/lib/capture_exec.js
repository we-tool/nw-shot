var exec = require('child_process').exec
var os = require('os')
var fs = require('fs')
var path = require('path')

// freeware nircmd http://www.nirsoft.net/utils/nircmd.html
var nircmdc = path.resolve(__dirname, '../bin/nircmdc.exe')

function captureCommand (options) {

  var file = options.file
  var interative = options.interative

  switch (os.platform()) {
    case 'win32':
      return '"' + nircmdc + '" savescreenshot "' + file + '"'
    case 'darwin':
      return 'screencapture -x ' +
        (interative ? '-i ' : '') + '"' + file + '"'
    default:
      throw new Error('unsupported platform')
  }
}

exports.capture = function (options, callback) {

  var file = options.file

  exec(captureCommand(options), function (err) {
    // nircmd always exits with err even though it works
    if (err && os.platform() !== 'win32') callback(err)

    fs.exists(file, function (exists) {
      // check exists for success/fail instead
      if (!exists) {
        return callback(new Error('Screenshot failed'))
      }
      callback(null, file)
    })
  })
}
