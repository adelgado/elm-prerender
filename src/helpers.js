export default {
	/* Turns a path to a file into a valid Elm module name */
	modulifyPath: (name, basedir) => {
		if (!basedir.endsWith('/')) {
			// Make sure there are no leading slashes on our module names
			basedir = `${basedir}/`
		}

		return name
			.replace(RegExp(`^${basedir}`), '')         // Remove base directory
			.replace('\.elm', '')                       // Remove extension
			.replace('/', '.')                // Make it a legal Elm module name
	}
,
	moduleToPortName: moduleName =>
		moduleName.replace('.','_').toLowerCase()
}
