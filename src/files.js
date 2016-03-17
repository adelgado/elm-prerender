import { find, grep }                from 'shelljs'

export default {

	listByPath (path) {
		const files = find(path)
		return this.filterFiles(files, path)
	}
,

	filterFiles (files, path) {
		return (files
			.filter(file => file.match(/\.elm$/))        // .elm files
			.filter(file => grep('view =', file) !== '') // with a view function
			.map(file => file.replace(path, ''))         // with a
			.map(file => file.replace(/^\//, ''))        //        relative path
		)
	}

}
