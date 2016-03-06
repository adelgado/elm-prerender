export default function (options) {
	const { portName, moduleName } = options

	return `
port ${portName} : String
port ${portName} =
    ${moduleName}.view
        |> render`
}
