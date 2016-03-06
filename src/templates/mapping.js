export default function (options) {
	const {port, file} = options

	return (
		`echo "fs.writeFile('${file}.html', elm.ports['${port}'])" >> _main.js`
	)
}
