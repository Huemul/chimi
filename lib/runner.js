const { taskOfSnippets } = require('./lib')
const { createSpinner, reportResults } = require('./reporter')

function runner(dependencies, timeout, glob) {
  const spinner = createSpinner()

  spinner.start()

  return taskOfSnippets(dependencies, timeout, glob)
    .map(reportResults(spinner, glob))
    .fork(
      error => spinner.fail(error.message),
      ({ reject }) => {
        process.exit(Boolean(reject) ? 1 : 0)
      }
    )
}

module.exports = runner
