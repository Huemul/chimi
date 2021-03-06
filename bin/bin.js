#!/usr/bin/env node

const meow = require('meow')
const chalk = require('chalk')
const debug = require('debug')('chimi')

const runner = require('../lib/runner')
const readConfig = require('../lib/config')

const msg = `
  ${chalk.bold.white('Usage')}
  $ chimi -f <file>

  ${chalk.bold.white('Options')}
    --file,    -f      File or glob matching multiple files (default: "README.md")
    --help,    -h      Show help
    --silent           Prevent snippets from printing messages through the console
    --version, -v, -V  Show version

  ${chalk.bold.white('Examples')}
    $ chimi -f README.md

    $ chimi -f 'doc/*.md'
`

const cli = meow(msg, {
  alias: {
    f: 'file',
    h: 'help',
    v: 'version',
    V: 'version',
  },
  default: {},
})

const config = readConfig()

debug('Running with config %o', config)
const file = cli.flags.file || config.file

runner(file, config, cli.flags)
