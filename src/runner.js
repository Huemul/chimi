const Future = require('fluture')

const { taskOfSnippets } = require('./lib')
const { createSpinner, reportResults } = require('./reporter')

function runner(glob, config, { silent }) {
  const spinner = createSpinner()

  spinner.start()

  return taskOfSnippets(config, glob)
    .chain(Future.encase(reportResults(spinner, glob, silent)))
    .fork(
      error => spinner.fail(error.message),
      (results = { reject: 1 }) => {
        process.exit(results.reject ? 1 : 0)
      }
    )
}

module.exports = runner
