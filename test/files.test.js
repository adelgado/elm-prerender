/* eslint-env mocha */

import assert from 'assert'

import files   from '../src/files.js'

describe('Files', () => {
	describe('#filterElmViewFile', () => {
		it('should return expected file names (./with/such/folders)', () => {
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
				'./test/fixtures/files_filterFiles/Blog/Index.elm',
				'./test/fixtures/files_filterFiles/Index.elm'
			]

			const output = files.filterElmViewFile(input.files, input.path)

			assert.deepEqual(output, expectedOutput)
		})

		it('should return expected file names (with/such/folders)', () => {
			const input = {
				files: [
					'test/fixtures/files_filterFiles',
					'test/fixtures/files_filterFiles/Blog',
					'test/fixtures/files_filterFiles/Blog/Index.elm',
					'test/fixtures/files_filterFiles/Index.elm',
					'test/fixtures/files_filterFiles/Users.elm'
				],
				path: 'test/fixtures/files_filterFiles'
			}

			const expectedOutput = [
				'test/fixtures/files_filterFiles/Blog/Index.elm',
				'test/fixtures/files_filterFiles/Index.elm'
			]

			const output = files.filterElmViewFile(input.files, input.path)

			assert.deepEqual(output, expectedOutput)
		})
	})
})
