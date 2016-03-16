import assert from 'assert'

import helpers from '../src/helpers.js'

describe('Helpers', () => {
	describe('#modulifyPath', () => {
		it('should remove the leading slash', () => {
			const input = '/Blog/Index'
			const expectedOutput = 'Blog.Index'

			const output = helpers.modulifyPath(input)

			assert.equal(expectedOutput, output)
		})

		it('should convert non-leading slashes to dots', () => {
			const input = 'Blog/Index'
			const expectedOutput = 'Blog.Index'

			const output = helpers.modulifyPath(input)

			assert.equal(expectedOutput, output)
		})
	})
})
