export default function (options) {
	const {rendererFilename, mappings} = options

	return `
#!/bin/sh
elm-package install --yes
elm make ${rendererFilename} --output=_main.js
echo "var fs = require('fs');" >> _main.js
echo "var elm = Elm.worker(Elm.Renderer);" >> _main.js
${mappings}
node _main.js`
}
