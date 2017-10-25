const { stripIndent } = require('common-tags')
const { injectDependencies, listDependencies } = require('../lib/lib')

describe('lib', () => {
  describe('listDependencies', () => {
    const dependencies = [
      'trae',
      { module: 'es6-promise' },
      { name: '_', module: 'lodash' },
      { name: 'config', module: './config', type: 'let' },
    ]

    it('should list dependencies in different types', () => {
      expect(listDependencies(dependencies)).toMatchSnapshot()
    })
  })

  describe('injectDependencies', () => {
    const code = stripIndent`
      const answer = 42

      console.log(answer)
    `

    it('should only add the source maps code when no dependencies are passed', () => {
      const result = injectDependencies([], {}, code)

      expect(result).toMatchSnapshot()
    })

    it('should not change snippet indentation', () => {
      const withIndentation = stripIndent`
        const foo = {
          bar: "bar"
        };

        Promise.resolve(foo)
          .then(({ bar }) => bar)
          .then(bar => {
            console.log(bar);
          });
      `
      let result = injectDependencies([], {}, withIndentation)

      expect(result).toMatchSnapshot()

      const dependencies = [
        {
          name: '_',
          module: 'lodash',
        },
        {
          name: 'lib',
          module: './lib',
        },
      ]
      result = injectDependencies(dependencies, {}, withIndentation)

      expect(result).toMatchSnapshot()
    })

    it('should prepend requires with variable declarations to the input', () => {
      let dependencies = [
        {
          name: '_',
          module: 'lodash',
        },
      ]
      let result = injectDependencies(dependencies, {}, code)

      expect(result).toMatchSnapshot()

      dependencies = [
        {
          name: '_',
          module: 'lodash',
        },
        'trae',
      ]
      result = injectDependencies(dependencies, {}, [], code)

      expect(result).toMatchSnapshot()
    })

    it('should work for local dependencies', () => {
      const dependencies = [
        {
          name: 'lib',
          module: './lib',
        },
        {
          name: 'bar',
          module: '../foo/bar',
        },
      ]
      const result = injectDependencies(dependencies, {}, code)

      expect(result).toMatchSnapshot()
    })

    it('should not add a variable declaration when dependencies map values are falsy', () => {
      const dependencies = [
        {
          module: './for-the-side-effects',
        },
        {
          module: 'es6-promise',
        },
      ]
      const result = injectDependencies(dependencies, {}, [], code)

      expect(result).toMatchSnapshot()
    })

    it('should add globals', () => {
      const globals = {
        theAnswer: 42,
      }
      const result = injectDependencies([], globals, code)

      expect(result).toMatchSnapshot()
    })

    it('should add globals and dependencies', () => {
      const dependencies = {
        lodash: '_',
      }
      const globals = {
        theAnswer: 42,
      }
      const result = injectDependencies(dependencies, globals, code)

      expect(result).toMatchSnapshot()
    })

    it('should interpolate functions, arrays, objets and strings properly', () => {
      const globals = {
        add: '(a, b) => a + b',
        message: "'hello world'",
        foo: "{ foo: 'bar' }",
        fruits: "['orange', 'apple']",
      }
      const result = injectDependencies([], globals, code)

      expect(result).toMatchSnapshot()
    })
  })
})
