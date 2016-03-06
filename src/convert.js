import fs                            from 'fs'
import glob                          from 'glob'
import linebyline                    from 'n-readlines'
import spawn                         from 'cross-spawn'

function listFiles(path) {
	const isElmFile = file => getFilename(file).split('.')[1] === 'elm'

	return (glob
		.sync(path + '**')
		.filter(isFile)
		.filter(isElmFile)
		.filter(hasView)
		.map(file => file.replace(path, ''))
	)
}

function generatePort(module_name) {
	const port_name = portName(module_name)
	return `
port ${port_name} : String
port ${port_name} =
    ${module_name}.view
        |> render`
}

function generateImport(module_name) {
	return `import ${module_name}`
}

function portName(module_name) {
	return module_name.replace('.','').toLowerCase()
}

function fileName(module_name, basedir, with_lower) {
	if (basedir === null) {
		basedir = './'
	}

	const with_basedir = basedir + module_name.replace('.','/')

	if (with_lower) {
		return with_basedir.toLowerCase()
	}

	return with_basedir
}

function generateMapping(port, file) {
	return `echo "fs.writeFile('${file}.html', elm.ports['${port}']);" >> _main.js`
}

function generate_vdom(module_names, basedir) {
	const port_files = []

	for (let i = module_names.length - 1; i >= 0; i--) {
		port_files.push({
			'port' : portName(module_names[i]),
			'filename' : fileName(module_names[i], basedir, false)
		})
	}

	const ports = module_names.map(generatePort).join('\n')
	const imports = module_names.map(generateImport).join('\n')

	const port_file_values = port_files.map(function(curr) {
		return curr.filename
	})

	const maps = port_files.map(function(curr) {
		return generateMapping(curr.port, curr.filename)
	})

	const mappings = maps.join('\n')

	makeFolders(port_file_values)


	const renderer_filename = '_Renderer.elm'
	const runner_filename = './runner.sh'

	const template = `
module Renderer where
import Html exposing (Html)
import Native.Renderer

${imports}

render : Html -> String
render = Native.Renderer.toHtml

${ports}`

	fs.writeFile(renderer_filename, template)

	const executor = `
#!/bin/sh
elm-package install --yes
elm make ${renderer_filename} --output=_main.js
echo "var fs = require('fs');" >> _main.js
echo "var elm = Elm.worker(Elm.Renderer);" >> _main.js
${mappings}
node _main.js`

	fs.writeFileSync(runner_filename, executor)

	executeBash(runner_filename)
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

function isFile(path) {
	return fs.lstatSync(path).isFile()
}

function getFilename(path) {
	const parts = path.split('/')
	return parts[parts.length - 1]
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

function cleanUp(name) {
	const new_name = name.replace(__dirname, '')
	return new_name.split('.')[0].replace('/', '.')
}

function executeBash(filename) {
	fs.chmod(filename, '0755')
	spawn('sh', [filename], { stdio: 'inherit' })
}

function main() {
	const files = listFiles('examples/').map(cleanUp)
	generate_vdom(files, 'output/')
}

main()
