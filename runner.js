const { snipper }        = require('./package.json')
const defaults           = require('./defaults')
const { taskOfSnippets } = require('./lib')
const {
  createSpinner,
  reportNoFilesFound,
  reportResults
} = require('./reporter')

const file = snipper.file || defaults.file
const spinner = createSpinner()

spinner.start()

taskOfSnippets(file).fork(
  reportNoFilesFound(spinner, file),
  reportResults(spinner, file)
)

