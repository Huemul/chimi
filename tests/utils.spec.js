const { listDependencies } = require('../lib/utils')

describe('utils', () => {
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
})
