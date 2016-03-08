export default function (options) {
	const {port, file} = options

	return (
		`\nfs.writeFile('${file}.html', elm.ports['${port}'])`
	)
}
