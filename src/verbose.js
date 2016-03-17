let verbose = false

export default {
	setVerbosity: value => (verbose = !!value),
	isVerbose: () => verbose
}
