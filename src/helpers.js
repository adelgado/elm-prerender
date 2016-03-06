export default {
	modulifyPath: (name) =>
		name
			.replace(__dirname, '')   // Make path relative
			.split('.')[0]            // Remove extension
			.replace('/', '.')        // Make it a legal Elm module name
,
	moduleToPortName: (moduleName) =>
		moduleName.replace('.','_').toLowerCase()
}
