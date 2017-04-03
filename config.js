const fs       = require('fs')
const defaults = require('./defaults')

function getConfig() {
  const conf = fs.existsSync('.snipperrc')
    ? JSON.parse(fs.readFileSync('.snipperrc'))
    : {}
  return Object.assign(defaults, conf)
}

module.exports = getConfig();
