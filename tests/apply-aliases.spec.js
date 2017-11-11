const applyAliases = require('../transformers/apply-aliases')
const { stripIndent } = require('common-tags')

describe('apply-aliases', () => {
  it('should transform requires', () => {
    const inputCode = stripIndent`
      const foo = require('foo')

      console.log(foo)
    `

    const { code } = applyAliases({ foo: 'bar' })('README.md', inputCode)

    expect(code).toMatchSnapshot()
  })

  it('should transform imports', () => {
    const inputCode = stripIndent`
      import foo from 'foo'

      console.log(foo)
    `

    const { code } = applyAliases({ foo: 'bar' })('README.md', inputCode)

    expect(code).toMatchSnapshot()
  })

  it('should transform both requires and imports', () => {
    const inputCode = stripIndent`
      const foo = require('foo')
      import qux from 'qux'

      console.log(foo)
    `

    const aliases = {
      foo: 'bar',
      qux: 'qux2',
    }

    const { code } = applyAliases(aliases)('README.md', inputCode)

    expect(code).toMatchSnapshot()
  })

  it('should not modify requires that are not in the aliases object', () => {
    const inputCode = stripIndent`
      const foo = require('foo')
      const qux = require('qux')

      console.log(foo)
    `

    const { code } = applyAliases({ foo: 'bar' })('README.md', inputCode)

    expect(code).toMatchSnapshot()
  })

  it('should not modify imports that are not in the aliases object', () => {
    const inputCode = stripIndent`
      import foo from 'foo'
      import qux from 'qux'

      console.log(foo)
    `

    const { code } = applyAliases({ foo: 'bar' })('README.md', inputCode)

    expect(code).toMatchSnapshot()
  })

  it('should do nothing if the aliases object is empty', () => {
    const inputCode = stripIndent`
      const foo = require('foo')
      const qux = require('qux')

      console.log(foo)
    `

    const { code } = applyAliases({})('README.md', inputCode)

    expect(code).toMatchSnapshot()
  })

  it('should handle invalid code', () => {
    const inputCode = stripIndent`
      const foo require('foo')

      console.log(foo)
    `

    const { code } = applyAliases({})('README.md', inputCode)

    expect(code).toBeNull()
  })
})
