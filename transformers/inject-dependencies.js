const { SourceMapGenerator } = require('source-map')

const S = require('../lib/sanctuary')

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

const generateSourceMaps = (
  file = 'snippet.js',
  code,
  position,
  dependencies,
  globals
) => {
  const source = process.env.NODE_ENV === 'dev' ? `/${file}` : file
  const decoratedCodeFirstLine =
    1 +
    1 + // require source-map-suppor
    1 + // comment
    dependencies.split('\n').length + // dependencies
    globals.split('\n').length + // globals
    1 // empty line

  const codeLinesCount = code.split('\n').length

  const map = new SourceMapGenerator({
    file: '/decorated-snippet.js',
  })

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < codeLinesCount; i++) {
    map.addMapping({
      generated: {
        line: decoratedCodeFirstLine + i,
        column: 0,
      },
      original: {
        line: position.start.line + i + 1,
        column: 0,
      },
      source,
    })
  }

  map.setSourceContent(source, code)

  return map.toJSON()
}

/**
 * Add dependencies to the top of the code.
 * position: { start: { line: Number } }
 * deps: array of dependencies, [(string|object)]
 * globals: object mapping globals
 */
const injectDependencies = (position, deps, globals) => (filename, code) => {
  const depsStr = listDependencies(deps || [])
  const globalsStr = listGlobals(globals || {})
  const sourceMaps = generateSourceMaps(
    filename,
    code,
    position,
    depsStr,
    globalsStr
  )

  const injectedCode = [
    "require('source-map-support').install()",
    '// snippet dependencies',
    depsStr,
    globalsStr,
    '',
    code,
  ].join('\n')

  return {
    code: injectedCode,
    map: sourceMaps,
  }
}

module.exports = injectDependencies
