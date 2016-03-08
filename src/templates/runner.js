export default function (options) {
	const {rendererFilename, fileMappings} = options

	return `
#!/bin/sh
echo "var fs = require('fs');" >> _main.js
echo "var elm = Elm.worker(Elm.Renderer);" >> _main.js
${fileMappings}
node _main.js`
}
