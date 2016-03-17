/* eslint-env mocha */

import assert from 'assert'

import helpers from '../src/helpers.js'

describe('Helpers', () => {
	describe('#modulifyPath', () => {
		it('should throw on leading slash', () => {
			const input = '/Blog/Index'

			assert.throws(helpers.modulifyPath, Error, input)
		})

		it('should convert non-leading slashes to dots', () => {
			const input = 'Blog/Index'
			const expectedOutput = 'Blog.Index'

			const output = helpers.modulifyPath(input)

			assert.equal(output, expectedOutput)
		})
	})
})
