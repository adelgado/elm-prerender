import fs                            from 'fs'
import linebyline                    from 'n-readlines'
import spawn                         from 'cross-spawn'
import { find }                      from 'shelljs'

function listFiles(path) {
	return (find(path)
		.filter(file => file.match(/\.elm$/))
		.filter(hasView)
		.map(file => file.replace(path, ''))
	)
}

function generatePort(moduleName) {
	const portName = getPortName(moduleName)
	return `
port ${portName} : String
port ${portName} =
    ${moduleName}.view
        |> render`
}

function generateImport(moduleName) {
	return `import ${moduleName}`
}

function getPortName(moduleName) {
	return moduleName.replace('.','').toLowerCase()
}

function fileName(moduleName, basedir, withLower) {
	if (basedir === null) {
		basedir = './'
	}

	const withBasedir = basedir + moduleName.replace('.','/')

	if (withLower) {
		return withBasedir.toLowerCase()
	}

	return withBasedir
}

function generateMapping(port, file) {
	return `echo "fs.writeFile('${file}.html', elm.ports['${port}']);" >> _main.js`
}

function generateVDom(moduleNames, basedir) {
	const portFiles = []

	for (let i = moduleNames.length - 1; i >= 0; i--) {
		portFiles.push({
			'port' : getPortName(moduleNames[i]),
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

	const template = `
module Renderer where
import Html exposing (Html)
import Native.Renderer

${imports}

render : Html -> String
render = Native.Renderer.toHtml

${ports}`

	fs.writeFile(rendererFilename, template)

	const executor = `
#!/bin/sh
elm-package install --yes
elm make ${rendererFilename} --output=_main.js
echo "var fs = require('fs');" >> _main.js
echo "var elm = Elm.worker(Elm.Renderer);" >> _main.js
${mappings}
node _main.js`

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

function hasView(filename) {
	const liner = new linebyline(filename)
	let line

	while (line = liner.next()) {
		if (line.indexOf('view =') != -1) {
			return true
		}
	}
	return false
}

function executeBash(filename) {
	fs.chmod(filename, '0755')
	spawn('sh', [filename], { stdio: 'inherit' })
}

function main(inputFolder, outputFolder) {
	const modules = listFiles(inputFolder).map(name =>
		name
			.replace(__dirname, '') // Make path relative
			.split('.')[0] // Remove extension
			.replace('/', '.') // Make it a legal Elm module name
	)

	generateVDom(modules, outputFolder)
}

export default main
