const { taskOfSnippets } = require('./lib')
const { createSpinner, reportResults } = require('./reporter')

function runner(timeout, glob) {
  const spinner = createSpinner()

  spinner.start()

  return taskOfSnippets(timeout, glob).fork(
    error => spinner.fail(error.message),
    reportResults(spinner, glob)
  )
}

module.exports = runner
