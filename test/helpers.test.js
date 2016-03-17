/* eslint-env mocha */

import assert from 'assert'

import helpers from '../src/helpers.js'

describe('Helpers', () => {
	describe('#modulifyPath', () => {
		it('should remove the base directory (with/such/directory)', () => {
			const input = {
				fileName: 'test/fixtures/main/input/Blog/Index.elm',
				basedir: 'test/fixtures/main/input'
			}

			const expectedOutput = 'Blog.Index'

			const output = helpers.modulifyPath(input.fileName, input.basedir)

			assert.equal(output, expectedOutput)
		})

		it('should remove the base directory (with/such/directory/)', () => {
			const input = {
				fileName: 'test/fixtures/main/input/Blog/Index.elm',
				basedir: 'test/fixtures/main/input/'
			}

			const expectedOutput = 'Blog.Index'

			const output = helpers.modulifyPath(input.fileName, input.basedir)

			assert.equal(output, expectedOutput)
		})

		it('should support empty string basedir', () => {
			const input = 'Blog/Index'
			const expectedOutput = 'Blog.Index'

			const output = helpers.modulifyPath(input, '')

			assert.equal(output, expectedOutput)
		})

		it('should support current folder basedir', () => {
			const input = 'Blog/Index'
			const expectedOutput = 'Blog.Index'

			const output = helpers.modulifyPath(input, './')

			assert.equal(output, expectedOutput)
		})
	})
})
