const recast = require('recast')
const babylon = require('babylon')

const { types } = recast
const n = types.namedTypes
const b = types.builders

/**
 * Apply the given aliases to the code requires/imports
 *
 * Returns an object with the transformed code and the sourcemaps
 */
const applyAliases = (aliases = {}) => (filename, code) => {
  let ast = null

  try {
    ast = recast.parse(code, {
      sourceFileName: filename,
      parser: babylon,
    })
  } catch (e) {
    return {
      code: null,
      error: e,
    }
  }

  recast.visit(ast, {
    visitCallExpression(path) {
      const expression = path.node

      const isRequire = expression.callee.name === 'require'
      const isLiteral =
        expression.arguments.length === 1 &&
        n.Literal.check(expression.arguments[0])
      if (isRequire && isLiteral) {
        const requireArgument = expression.arguments[0].value
        if (requireArgument in aliases) {
          expression.arguments[0] = b.literal(aliases[requireArgument])
        }
      }

      this.traverse(path)
    },
    visitImportDeclaration(path) {
      const { node } = path
      const isLiteral = n.Literal.check(node.source)

      if (isLiteral) {
        const importArgument = node.source.value
        if (importArgument in aliases) {
          node.source.value = aliases[importArgument]
        }
      }

      this.traverse(path)
    },
  })

  const result = recast.print(ast)

  return {
    code: result.code,
    map: result.map,
  }
}

module.exports = applyAliases
