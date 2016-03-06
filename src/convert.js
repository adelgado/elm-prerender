import fs                            from 'fs'
import spawn                         from 'cross-spawn'
import { find, grep }                from 'shelljs'

import portTemplate                  from './templates/port'
import mappingTemplate               from './templates/mapping'
import rendererTemplate              from './templates/renderer'
import executorTemplate              from './templates/executor'
import importTemplate                from './templates/import'

import helpers                       from './helpers'

function listFiles(path) {
	return (find(path)
		.filter(file => file.match(/\.elm$/))
		.filter(file => grep('view =', file) !== '')
		.map(file => file.replace(path, ''))
	)
}

function generatePort(moduleName) {
	const portName = helpers.moduleToPortName(moduleName)
	return portTemplate({portName, moduleName})
}

function generateImport(moduleName) {
	return importTemplate({moduleName})
}

function fileName(moduleName, basedir = './', withLower) {
	const withBasedir = basedir + moduleName.replace('.','/')

	if (withLower) {
		return withBasedir.toLowerCase()
	}

	return withBasedir
}

function generateMapping(port, file) {
	return mappingTemplate({port, file})
}

function generateVDom(moduleNames, basedir) {
	const portFiles = []

	for (let i = moduleNames.length - 1; i >= 0; i--) {
		portFiles.push({
			'port' : helpers.moduleToPortName(moduleNames[i]),
			'filename' : fileName(moduleNames[i], basedir, false)
		})
	}

	const ports = moduleNames.map(generatePort).join('\n')
	const imports = moduleNames.map(generateImport).join('\n')

	const portFileValues = portFiles.map(curr => curr.filename)

	const maps = portFiles.map(curr =>
		generateMapping(curr.port, curr.filename)
	)

	const mappings = maps.join('\n')

	makeFolders(portFileValues)

	const rendererFilename = '_Renderer.elm'
	const runnerFilename = './runner.sh'

	const template = rendererTemplate({imports, ports})

	fs.writeFile(rendererFilename, template)

	const executor = executorTemplate({rendererFilename, mappings})

	fs.writeFileSync(runnerFilename, executor)

	executeBash(runnerFilename)
}

function makeFolders(filenames) {
	filenames.forEach(function(filename) {
		if (filename.split('/').length > 1 || filename.startsWith('.') != -1) {
			const dir = filename.substring(0, filename.lastIndexOf('/'))
			try {
				fs.mkdirSync(dir)
			} catch (e) {
				if (e.code === 'EEXIST') {
					console.warn(`${dir} already exists`)
				} else {
					throw e
				}
			}
		}
	})
}

function executeBash(filename) {
	fs.chmod(filename, '0755')
	spawn('sh', [filename], { stdio: 'inherit' })
}

function main(inputFolder, outputFolder) {
	const modules = listFiles(inputFolder).map(helpers.modulifyPath)

	generateVDom(modules, outputFolder)
}

export default main
