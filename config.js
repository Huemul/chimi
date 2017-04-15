const fs = require('fs')
const defaults = require('./defaults')

function getConfig() {
  const conf = fs.existsSync('.chimirc')
    ? JSON.parse(fs.readFileSync('.chimirc'))
    : {}
  return Object.assign(defaults, conf)
}

module.exports = getConfig()
