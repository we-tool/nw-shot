var _ = require('lodash')
var tmp = require('tmp')
var capture = require('./lib/capture_exec').capture

/*
   Capture a screenshot and resolve with the image path

   @param {String} [filePath]
   @param {Function} callback
*/
module.exports = function screencapture (options, callback) {

  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  var file = options.file

  if (file) {
    capture(options, callback)
  } else {
    tmp.tmpName({ postfix: '.png' }, function (err, tmpPath) {
      if (err) callback(err)
      capture(_.assign({}, options, { file: tmpPath }), callback)
    })
  }
}
