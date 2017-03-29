const { taskOfSnippets } = require('./lib')
const {
  createSpinner,
  reportNoFilesFound,
  reportResults
} = require('./reporter')

const file = 'example.md'

const spinner = createSpinner()

spinner.start()

taskOfSnippets(file).fork(reportNoFilesFound, reportResults(spinner, file))

