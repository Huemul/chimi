const { taskOfSnippets } = require('./lib')
const {
  createSpinner,
  reportNoFilesFound,
  reportResults,
} = require('./reporter')

function runner(timeout, file) {
  const spinner = createSpinner()

  spinner.start()

  return taskOfSnippets(timeout, file).fork(
    reportNoFilesFound(spinner, file),
    reportResults(spinner, file)
  )
}

module.exports = runner
