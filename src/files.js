import { find, grep }                from 'shelljs'

export default {

	listByPath (path) {
		const files = find(path)
		return this.filterFiles(files, path)
	}
,

	filterFiles (files, path) {
		return (files
			.filter(file => file.match(/\.elm$/))
			.filter(file => grep('view =', file) !== '')
			.map(file => file.replace(path, ''))
			.map(file => file.replace(/^\//, ''))
		)
	}

}
