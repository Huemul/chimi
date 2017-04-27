#!/usr/bin/env node
const argv = require('minimist')(process.argv.slice(2), {
  alias: {
    file: 'f',
  },
})

const runner = require('../lib/runner')
const config = require('../lib/config')

const file = argv.file || config.file

runner(config.timeout, file)
