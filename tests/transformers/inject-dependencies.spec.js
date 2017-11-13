const { stripIndent } = require('common-tags')

const injectDependencies = require('../../lib/transformers/inject-dependencies')

describe('injectDependencies', () => {
  const code = stripIndent`
    const answer = 42

    console.log(answer)
  `

  const position = {
    start: { line: 0, column: 0 },
  }

  it('should add source maps but no dependencies', () => {
    const result = injectDependencies(position, [], {})('README.md', code)

    expect(result.code).toMatchSnapshot()
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
    let result = injectDependencies(position, [], {})(
      'README.md',
      withIndentation
    )

    expect(result.code).toMatchSnapshot()

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
    result = injectDependencies(position, dependencies, {})(
      'README.md',
      withIndentation
    )

    expect(result.code).toMatchSnapshot()
  })

  it('should prepend requires with variable declarations to the snippet code', () => {
    let dependencies = [
      {
        name: '_',
        module: 'lodash',
      },
    ]
    let result = injectDependencies(position, dependencies, {})(
      'README.md',
      code
    )

    expect(result.code).toMatchSnapshot()

    dependencies = [
      {
        name: '_',
        module: 'lodash',
      },
      'trae',
    ]
    result = injectDependencies(position, dependencies, {})('README.md', code)

    expect(result.code).toMatchSnapshot()
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
    const result = injectDependencies(position, dependencies, {})(
      'README.md',
      code
    )

    expect(result.code).toMatchSnapshot()
  })

  it('should add requires with no declaration when the name is missing', () => {
    const dependencies = [
      {
        module: './for-the-side-effects',
      },
      {
        module: 'es6-promise',
      },
    ]
    const result = injectDependencies(position, dependencies, {})(
      'README.md',
      code
    )

    expect(result.code).toMatchSnapshot()
  })

  it('should add globals', () => {
    const globals = {
      theAnswer: 42,
    }
    const result = injectDependencies(position, [], globals)('README.md', code)

    expect(result.code).toMatchSnapshot()
  })

  it('should add globals and dependencies', () => {
    const dependencies = [
      {
        name: '_',
        module: 'lodash',
      },
    ]
    const globals = {
      theAnswer: 42,
    }
    const result = injectDependencies(position, dependencies, globals)(
      'README.md',
      code
    )

    expect(result.code).toMatchSnapshot()
  })

  it('should interpolate functions, arrays, objets and strings properly', () => {
    const globals = {
      add: '(a, b) => a + b',
      message: "'hello world'",
      foo: "{ foo: 'bar' }",
      fruits: "['orange', 'apple']",
    }
    const result = injectDependencies(position, [], globals)('README.md', code)

    expect(result.code).toMatchSnapshot()
  })
})
