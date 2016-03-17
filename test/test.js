/* eslint-env mocha */

import assert from 'assert'

import helpers from '../src/helpers.js'
import files   from '../src/files.js'

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


describe('Files', () => {
	describe('#filterFiles', () => {
		it('should not return file names with leading slashes', () => {
			const input = {
				files: [
					'./test/fixtures/files_filterFiles',
					'./test/fixtures/files_filterFiles/Blog',
					'./test/fixtures/files_filterFiles/Blog/Index.elm',
					'./test/fixtures/files_filterFiles/Index.elm',
					'./test/fixtures/files_filterFiles/Users.elm'
				],
				path: './test/fixtures/files_filterFiles'
			}

			const expectedOutput = [
				'Blog/Index.elm',
				'Index.elm'
			]

			const output = files.filterFiles(input.files, input.path)

			assert.deepEqual(output, expectedOutput)
		})
	})
})
