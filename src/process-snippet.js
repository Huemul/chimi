const merge = require('merge-source-map')

const applyAliases = require('./transformers/apply-aliases')
const importToRequire = require('./transformers/import-to-require')
const injectDependencies = require('./transformers/inject-dependencies')

const sourceMapsPrefix =
  '//# sourceMappingURL=data:application/json;charset=utf-8;base64,'

/**
 * Take a string with code and a list of transformers and return the
 * transformed code and the composed sourcemaps
 */
const applyTransforms = (filename, inputCode, transformers) => {
  const finalResult = transformers.reduce(
    (previousResult, transformer) => {
      if (previousResult.code === null) {
        return previousResult
      }

      const result = transformer(filename, previousResult.code)

      if (result.code === null) {
        return result
      }

      const mergedMaps = merge(previousResult.map, result.map)

      return {
        code: result.code,
        map: mergedMaps,
      }
    },
    {
      code: inputCode,
      map: null,
    }
  )

  return finalResult
}

const addInlineSourcemap = (code, map) => {
  const sourceMapsBase64 = Buffer.from(JSON.stringify(map)).toString('base64')
  const sourceMapsInline = `${sourceMapsPrefix}${sourceMapsBase64}`

  const transformedCode = `${code}\n${sourceMapsInline}`

  return transformedCode
}

const processSnippet = (file, code, position, config) => {
  const injectDependenciesTransformer = injectDependencies(
    position,
    config.dependencies,
    config.globals
  )
  const importToRequireTransformer = importToRequire()
  const applyAliasesTransformer = applyAliases(config.aliases)

  const result = applyTransforms(file, code, [
    applyAliasesTransformer,
    injectDependenciesTransformer,
    importToRequireTransformer,
  ])

  if (result.error) {
    if (result.error.loc) {
      result.error.loc.line += position.start.line
      result.error.message = result.error.message.replace(/\s*\(\d+:\d+\)$/, '')
    }

    return {
      error: result.error,
      code: null,
    }
  }

  return {
    error: null,
    code: addInlineSourcemap(result.code, result.map),
  }
}

module.exports = {
  processSnippet,
  applyTransforms,
}
