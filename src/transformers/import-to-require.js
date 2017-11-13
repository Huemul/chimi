const babel = require('babel-core')
const transformModulesPlugin = require('babel-plugin-transform-es2015-modules-commonjs')

/**
 * Transform es2015 imports to CJS requires
 *
 * Returns an object with the transformed code and the sourcemaps
 */
const importToRequire = () => (filename, code) => {
  const options = {
    babelrc: false,
    sourceMaps: true,
    sourceFileName: filename,
    plugins: [[transformModulesPlugin]],
  }

  let result = null
  try {
    result = babel.transform(code, options)
  } catch (e) {
    return {
      code: null,
      error: e,
    }
  }

  return {
    code: result.code,
    map: result.map,
  }
}

module.exports = importToRequire
