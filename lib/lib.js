const fs = require('fs')
const R = require('ramda')
const Task = require('data.task')
const { List } = require('immutable-ext')
const { stripIndent } = require('common-tags')

const { readFile } = require('./utils')
const config = require('./config')
const runSnippet = require('./run-snippet')

// This regex matches:
//   ```(?:js|javascript): start of snippet with non-capturing group
//   ([\s\S]+?): snippet code in captrouring group with non-greedy wildcard
//   ```: end of snippet
const snippetMatcher = /```(?:js|javascript)([\s\S]+?)```/g

// FIRST LINE /^\s*#(.*)$/m
// This regex matches
//   ^\s* any whitespace a the beginning of the line
//   #  a hash character
//   (.*)$ any characters until the end of the line
//   /m makes ^ and $ match to any line
//   since 'g' is not used the match is done only to the first line

// extractSnippets :: String -> [String]
const extractSnippets = file => {
  const snippets = []

  let match = null
  while ((match = snippetMatcher.exec(file))) {
    snippets.push(match[1])
  }

  return snippets
}

// buildRequireExpression :: String -> String|{path: String} -> String
const buildRequireExpression = (dep, path) =>
  (typeof path === 'string'
    ? `let ${dep} = require('${path}')`
    : `require('${path.path}')`)

// listDependencies :: Object -> String
const listDependencies = deps =>
  Object.keys(deps)
    .map(key => buildRequireExpression(key, deps[key]))
    .map(r => r + ';')
    .join('\n')

// injectDependencies :: String -> Task
const injectDependencies = code => stripIndent`
  // snippet dependencies
  ${listDependencies(config.dependencies || [])}

  ${code}
`

const map = R.addIndex(R.map)

// traverseSnippets :: Int -> List(Task) -> Task(List)
const traverseSnippets = timeout => snippets =>
  snippets.traverse(Task.of, runSnippet(timeout))

// FileName :: String

// taskOfSnippets :: Int -> FileName -> Task(List)
const taskOfSnippets = (timeout, file) =>
  readFile(file)
    .map(extractSnippets)
    .map(R.map(injectDependencies))
    .map(map((snippet, id) => ({ snippet, id })))
    .map(List)
    .chain(traverseSnippets(timeout))

module.exports = { taskOfSnippets }
