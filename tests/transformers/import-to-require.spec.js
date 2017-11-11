const { stripIndent } = require('common-tags')

const importToRequire = require('../../lib/transformers/import-to-require')

describe('import-to-require', () => {
  it('should transform import to requires', () => {
    const inputCode = stripIndent`
      import foo from 'foo'

      console.log(foo)
    `

    const { code } = importToRequire()('README.md', inputCode)

    expect(code).toMatchSnapshot()
  })

  it('should handle invalid code', () => {
    const inputCode = stripIndent`
      import foo 'foo'

      console.log(foo)
    `

    const { code } = importToRequire({})('README.md', inputCode)

    expect(code).toBeNull()
  })
})
