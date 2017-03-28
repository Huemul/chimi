const fs        = require('fs')
const isolated  = require('require-from-string')
const R         = require('ramda')
const Task      = require('data.task')
const { List }  = require('immutable-ext')
const ora       = require('ora')

const { read } = require('./lib')
const pkg      = require('./package.json')

const file = 'example.md'

// This regex matches:
//   ```(?:js|javascript): start of snippet with non-capturing group
//   ([\s\S]+?): snippet code in captrouring group with non-greedy wildcard
//   ```: end of snippet
const snippetMatcher = /```(?:js|javascript)([\s\S]+?)```/g

// dependency :: String -> String|{path: String} -> String
const dependency = (dep, path) => typeof path === 'string'
  ? `let ${dep} = require('${path}')`
  : `require('${path.path}')`

// dependencies :: Object -> String
const dependencies = (deps) => Object
  .keys(deps)
  .reduce((acc, key) => `${acc}; ${dependency(key, deps[key])}`, '')

// doEval :: String -> Int -> Task
const doEval = (code) => isolated(`
  // snippet dependencies
  ${dependencies(pkg.sarasa.dependencies)}

  function snippet() {
    return new Promise((res, rej) => {
      try {
        const result = eval(\`${code}\`)
        res(result)
      } catch(e) {
        rej(e)
      }
    })
  }
  module.exports = snippet
`)()


// snippetTask :: String -> Int -> Task(Error, a)
const snippetTask = (code) =>
  new Task(
    (rej, res) => doEval(code)
      .then(value => res({value, ok: true}))
      .catch(error => res({error, ok: false}))
  )

// extractSnippets :: String -> [String]
const extractSnippets = file => {
  const snippets = []

  let match = null
  while (match = snippetMatcher.exec(file)) {
    snippets.push(match[1])
  }

  return snippets
}

// traverseSnippets :: List(Task) -> Task(List)
const traverseSnippets = snippets => snippets.traverse(Task.of, snippetTask)

const spinner = ora('Running snippets.').start()

read(file)
  .map(extractSnippets)
  .map(List)
  .chain(traverseSnippets)
  .fork(
    () => {
      spinner.fail(`No JS snippets found on ${file}.`)
      console.log(`\n¯\\_(ツ)_/¯`)
    },
    (results) => {

      const success = results.reduce((acc, cur) => cur.ok ? acc + 1 : acc, 0)
      const reject = results.reduce((acc, cur) => cur.ok ? acc : acc + 1, 0)

      spinner.succeed(`Run ${results.size} snippets.`)
      console.log(`\n  Succeded: ${success}`)
      console.log(`  Rejected: ${reject}`)
    }
  )

