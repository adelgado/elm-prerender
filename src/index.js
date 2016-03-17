import commandLineArgs      from 'command-line-args'
import getUsage             from 'command-line-usage'
import tool                 from 'command-line-tool'

import main from './main'
import verbose from './verbose'

const cliDefinitions = [
	{ name: 'input-folder'
	, alias: 'i'
	, typeLabel: 'folder'
	, description: 'Path to the input files'
	, type: String
	}
,
	{ name: 'output-folder'
	, alias: 'o'
	, typeLabel: 'folder'
	, description: 'Where to write the output files'
	, type: String
	}
,
	{ name: 'help'
	, alias: 'h'
	, description: 'Displays this usage text'
	, type: Boolean
	}
,
	{ name: 'verbose'
	, alias: 'v'
	, description: 'Display extended output'
	, type: Boolean
	}
]

const cli = commandLineArgs(cliDefinitions)
const options = cli.parse()

verbose.setVerbosity(options.verbose)

if (options.help) {
	const usage = getUsage(cliDefinitions, options)
	console.log(usage)
	tool.stop()
} else if (typeof options['input-folder'] == 'undefined') {
	console.log('Option --input-folder is not optional')
	tool.stop()
} else if (typeof options['output-folder'] == 'undefined') {
	console.log('Option --output-folder is not optional')
	tool.stop()
} else {
	main(options['input-folder'], options['output-folder'])
}
