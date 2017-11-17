const { SourceMapGenerator } = require('source-map')

const { listDependencies, listGlobals } = require('../utils')

const generateSourceMaps = (
  file = 'snippet.js',
  code,
  position,
  dependencies,
  globals
) => {
  const decoratedCodeFirstLine =
    1 +
    1 + // require source-map-suppor
    1 + // comment
    dependencies.split('\n').length + // dependencies
    globals.split('\n').length + // globals
    1 // empty line

  const codeLinesCount = code.split('\n').length

  const map = new SourceMapGenerator()

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
      source: file,
    })
  }

  map.setSourceContent(file, code)

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
