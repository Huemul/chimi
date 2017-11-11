const S = require('./sanctuary')

const appendSemi = r => `${r};`

const requireWithAssignment = (name, module, type = 'const') =>
  `${type} ${name} = require('${module || name}')`

const simpleRequire = module => `require('${module}')`

const handleDep = S.ifElse(
  S.is(String),
  requireWithAssignment,
  ({ name, module, type }) =>
    name ? requireWithAssignment(name, module, type) : simpleRequire(module)
)

const assignmentExpression = (key, value) => `let ${key} = ${value}`

const listDependencies = S.pipe([
  S.map(handleDep),
  S.map(appendSemi),
  S.joinWith('\n'),
])

const listGlobals = globals =>
  Object.keys(globals)
    .map(key => assignmentExpression(key, globals[key]))
    .map(appendSemi)
    .join('\n')

module.exports = {
  listDependencies,
  listGlobals,
}
