const { taskOfSnippets } = require('./lib')
const {
  createSpinner,
  reportNoFilesFound,
  reportResults,
} = require('./reporter')

function runner(timeout, glob) {
  const spinner = createSpinner()

  spinner.start()

  return taskOfSnippets(timeout, glob).fork(
    reportNoFilesFound(spinner),
    reportResults(spinner)
  )
}

module.exports = runner
