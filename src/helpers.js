export default {
	modulifyPath: name => {
		if (name.startsWith('/')) {
			const message =
				"File path must be relative (can't start with slash). " +
				`Got '${name}'`
			throw new Error(message)
		} else {
			return name
				.split('.')[0]            // Remove extension
				.replace('/', '.')        // Make it a legal Elm module name
		}
	}
,
	moduleToPortName: moduleName =>
		moduleName.replace('.','_').toLowerCase()
}
