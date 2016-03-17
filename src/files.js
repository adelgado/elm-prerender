import { grep }                from 'shelljs'

export default {

	filterElmViewFile (files) {
		return (files
			.filter(file => file.match(/\.elm$/))        // .elm files
			.filter(file => grep('view =', file) !== '') // with a view function
		)
	}

}
