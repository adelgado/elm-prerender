import fs                            from 'fs'
import spawn                         from 'cross-spawn'
import compiler                      from 'node-elm-compiler'
import { find }                      from 'shelljs'

import portTemplate                  from './templates/port'
import mappingTemplate               from './templates/mapping'
import rendererTemplate              from './templates/renderer'
import importTemplate                from './templates/import'

import helpers                       from './helpers'
import files                         from './files'
import verbose                       from './verbose'

function generatePort(moduleName) {
	const portName = helpers.moduleToPortName(moduleName)
	return portTemplate({portName, moduleName})
}

function generateImport(moduleName) {
	return importTemplate({moduleName})
}

function fileName(moduleName, basedir = './') {
	const withBasedir = basedir + moduleName.replace('.','/')

	return withBasedir
}

function generateMapping(port, file) {
	return mappingTemplate({port, file})
}

export default function main(inputFolder, outputFolder) {
	if (verbose.isVerbose()) {
		console.log('Input folder is', inputFolder)
		console.log('Ouput folder is', outputFolder)
	}

	const inputFiles = find(inputFolder)
	if (verbose.isVerbose()) {
		console.log('These are the input files', inputFiles)
	}

	const elmViewFiles = files.filterElmViewFile(inputFiles)
	if (verbose.isVerbose()) {
		console.log('The following suitable files were found', elmViewFiles)
	}

	const moduleNames = elmViewFiles.map(file =>
		helpers.modulifyPath(file, inputFolder)
	)
	if (verbose.isVerbose()) {
		console.log("We have the modules, they're", moduleNames)
	}

	const portFiles = []

	for (let i = moduleNames.length - 1; i >= 0; i--) {
		portFiles.push({
			'port' : helpers.moduleToPortName(moduleNames[i]),
			'filename' : fileName(moduleNames[i], outputFolder)
		})
	}

	const portFileValues = portFiles.map(curr => curr.filename)

	const maps = portFiles.map(curr =>
		generateMapping(curr.port, curr.filename)
	)

	const fileMappings = maps.join('\n')

	makeFolders(portFileValues)

	const ports = moduleNames.map(generatePort).join('\n')
	const imports = moduleNames.map(generateImport).join('\n')

	writeRendererAndMain(imports, ports, fileMappings)
}

function writeRendererAndMain(imports, ports, fileMappings) {
	const rendererFilename = '_Renderer.elm'

	const template = rendererTemplate({imports, ports})

	fs.writeFile(rendererFilename, template)

	compiler.compileToString([rendererFilename], { yes: true })
		.then(data => {
			data += "\nvar fs = require('fs')"
			data += '\nvar elm = Elm.worker(Elm.Renderer)'
			data += `\n${fileMappings}`
			fs.writeFileSync('./_main.js', data)
			spawn('node', ['./_main.js'], { stdio: 'inherit' })
		})
}

function makeFolders(filenames) {
	filenames.forEach(filename => {
		if (filename.split('/').length > 1 || filename.startsWith('.') !== -1) {
			const dir = filename.substring(0, filename.lastIndexOf('/'))
			try {
				fs.mkdirSync(dir)
			} catch (e) {
				if (e.code === 'EEXIST') {
					if (verbose.isVerbose()) {
						console.warn(`${dir} already exists`)
					}
				} else {
					throw e
				}
			}
		}
	})
}
