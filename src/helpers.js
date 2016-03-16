export default {
	modulifyPath: (name) =>
		name
			.replace(/^\//, '')       // Remove leading slash
			.split('.')[0]            // Remove extension
			.replace('/', '.')        // Make it a legal Elm module name
,
	moduleToPortName: (moduleName) =>
		moduleName.replace('.','_').toLowerCase()
}
